#######################
#JSC Javascript builder
#######################
#Step 2 of building JSC:
#   Sets up build environment
#   Determines build number of Javascript files
#   Writes JSON with (file: build number)
#   Copies the JS dirs into their respective places
#   Removes the beginning "//BUILD" of the .js files

import os
import json
import shutil

js_builds = {}
def run(use_extra):
    global js_builds
    print("2.1: use_extra -> "+str(use_extra))
    print("2.2: Building JS files.")
    passed = build("core", 1)
    if passed == False:
        return 1
    if use_extra == True:
        passed = build("extra", 2)
        if passed == False:
            return 2
    print("2.3: Writing JSONs")
    count = 1
    for jsb in js_builds:
        write_json(jsb, count)
        count += 1
    print("2.4: Copying JS dirs")
    count = 1
    for jsb in js_builds:
        copy_dir(jsb, count)
        count += 1
    print("2.5: Processing JS")
    process_js()

def build(what, num):
    print("2.2."+str(num)+": Building '"+what+"'")
    js_builds[what] = {}
    for dirname, dirnames, filenames in os.walk('src/javascript/'+what+'/'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            fn = fullname.replace("src/javascript/"+what+"/", "")
            print("Processing "+fn)
            process_file(fullname, fn, what)

def process_file(filename, fn, what):
    name, ext = os.path.splitext(filename)
    if ext != ".js":
        return
    with open(filename, 'r') as f:
        js_builds[what][fn] = int(f.readline().replace("//BUILD #", ""))

def write_json(jsb, count):
    global minify_json
    print("2.3."+str(count)+": Processing "+jsb)
    os.makedirs(".buildtmp/js/"+jsb+"/")
    with open(".buildtmp/js/"+jsb+"/"+jsb+"_builds.json", 'w') as outfile:
        json.dump(js_builds[jsb], outfile, indent=2, separators=(',',':'))

def copy_dir(jsb, count):
    print("2.4."+str(count)+": Copying "+jsb)
    src = "src/javascript/"+jsb+"/"
    dst = ".buildtmp/js/"+jsb+"/"
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        print(s+" -> "+d)
        if os.path.isdir(s):
            shutil.copytree(s, d)
        else:
            shutil.copy2(s, d)

def process_js():
    for dirname, dirnames, filenames in os.walk('.buildtmp/js/'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            name, ext = os.path.splitext(filename)
            if ext == ".js":
                print(fullname)
                with open(fullname, 'r') as fin:
                    data = fin.read().splitlines(True)
                with open(fullname, 'w') as fout:
                    fout.writelines(data[1:])