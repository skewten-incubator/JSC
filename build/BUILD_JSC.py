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
import sys
import cleanup

def quit():
    print("An error occured while building JSC. Aborting.")
    cleanup.run(tmpdirs,True)
    sys.exit(1)

print("0: Preparing build environment")
os.chdir("../")
tmpdirs = [
    ".buildtmp/",
    ".buildtmp/includes",
    ".buildtmp/js",
    ".buildtmp/java",
    ".buildtmp/bin"
]
if os.path.exists(tmpdirs[0]):
    cleanup.run(tmpdirs,True)
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
error = java_compile.run(conf)
if error == True:
    quit()

print("6: Generating .jar")
import jar_build
error = jar_build.run()
if error == True:
    quit()

print("7: Cleaning up")
cleanup.run(tmpdirs)

print("8: Done! Your new .jar is in JSC/bin.")