(ns tasks
  (:require
   [babashka.fs :as fs]
   [babashka.process :refer [shell]]
   [cheshire.core :as json]
   [node-repl-tests]
   [clojure.string :as str]))

(def test-config
  '{:compiler-options {:load-tests true}
    :modules {:squint_tests {:init-fn squint.compiler-test/init
                             :depends-on #{:compiler}}}})

(defn shadow-extra-test-config []
  (merge-with
   merge
   test-config))

(defn bump-core-vars []
  (let [core-vars (:out (shell {:out :string}
                               "node --input-type=module -e 'import * as squint from \"squint-cljs/core.js\";console.log(JSON.stringify(Object.keys(squint)))'"))
        parsed (apply sorted-set (map symbol (json/parse-string core-vars)))]
    (spit "resources/squint/core.edn" (with-out-str
                                        ((requiring-resolve 'clojure.pprint/pprint)
                                         parsed)))))

(defn build-squint-npm-package []
  (fs/create-dirs ".work")
  (fs/delete-tree "lib")
  (fs/delete-tree ".shadow-cljs")
  (bump-core-vars)
  (spit ".work/config-merge.edn" "{}")
  (shell "npx shadow-cljs --config-merge .work/config-merge.edn release squint"))

(defn publish []
  (build-squint-npm-package)
  (run! fs/delete (fs/glob "lib" "*.map"))
  (shell "esbuild src/squint/core.js --minify --format=iife --global-name=squint.core --outfile=lib/squint.core.umd.js")
  (shell "npm publish"))

(defn watch-squint []
  (fs/create-dirs ".work")
  (fs/delete-tree ".shadow-cljs/builds/squint/dev/ana/squint")
  (spit ".work/config-merge.edn" (shadow-extra-test-config))
  (bump-core-vars)
  (shell "npx shadow-cljs --aliases :dev --config-merge .work/config-merge.edn watch squint"))

(defn test-project [_]
  (let [dir "test-project"]
    (fs/delete-tree (fs/path dir "lib"))
    (shell {:dir dir} "npx squint compile")
    (let [output (:out (shell {:dir dir :out :string} "node lib/main.mjs"))]
      (println output)
      (assert (str/includes? output "macros2/debug 10"))
      (assert (str/includes? output "macros2/debug 6"))
      (assert (str/includes? output "macros/debug 10",))
      (assert (str/includes? output "macros/debug 6"))
      (assert (str/includes? output "my-other-src")))))

(defn test-squint []
  (fs/create-dirs ".work")
  (spit ".work/config-merge.edn" (shadow-extra-test-config))
  (bump-core-vars)
  (shell "npx shadow-cljs --config-merge .work/config-merge.edn compile squint")
  (shell "node lib/squint_tests.js")
  (node-repl-tests/run-tests {})
  (test-project {}))


