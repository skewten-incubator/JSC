################
#JSC builder 0.1
################
#Step 1 of building JSC:
#   Reads config.json
#   Determines settings
#   Runs the build scripts

import json
import os
import shutil

print("0: Preparing build environment")
os.chdir("../")
tmpdirs = [
    ".buildtmp/",
    ".buildtmp/js",
    ".buildtmp/java",
    ".buildtmp/bin",
    ".buildtmp/includes"
]
if os.path.exists(tmpdirs[0]):
    #Remove every dir EXCEPT the includes dir.
    shutil.rmtree(tmpdirs[1])
    shutil.rmtree(tmpdirs[2])
    shutil.rmtree(tmpdirs[3])
for tmpdir in tmpdirs:
    if not os.path.exists(tmpdir):
        os.makedirs(tmpdir)

print("1: Reading config.json")
with open("build/config.json") as conf_file:
    print("1.1: Opened config.json")
    conf = json.load(conf_file)
    print("1.2: Parsed config.json")
    conf_file.close()
    print("1.3: Closed config.json")

print("2: Building JS files")
import js_build
js_build.run(conf["use_extra"])

print("3: minify_javascript -> "+str(conf["minify_javascript"]))
if conf["minify_javascript"]:
    import js_minify
    js_minify.run(conf["minify_json"])

print("4: Creating JS zip files")
import js_zip
js_zip.run()

print("5: Compiling Java")
import java_compile
java_compile.run()

print("6: Generating .jar")
import jar_build
jar_build.run()