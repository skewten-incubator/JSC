########################
#JSC Javascript minifier
########################
#[OPTIONAL] Step 2.5 of building JSC:
#   Minifies JSON/JS files

import urllib.request
import urllib.parse
import os
import json

minify_json = False
def run(do_json):
    global minify_json
    print("3.1: Minifying JS")
    minify_json = do_json
    print("3.2: minify_json -> "+str(minify_json))
    for dirname, dirnames, filenames in os.walk('.buildtmp/js/'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            name, ext = os.path.splitext(filename)
            if ext == ".js":
                process_js(fullname)
            if minify_json == True and ext == ".json":
                process_json(fullname)

def process_js(filename):
    print("JS: Processing "+filename)
    with open(filename, 'r') as f:
        content = f.read()
    content = urllib.parse.urlencode({"input":content}).encode("utf-8")
    path = "http://javascript-minifier.com/raw"
    req = urllib.request.Request(path, content)
    page = urllib.request.urlopen(req).read()
    with open(filename, 'wb') as outfile:
        outfile.write(page)

def process_json(filename):
    print("JSON: Processing "+filename)
    with open(filename, 'r') as f:
        content = json.load(f)
    with open(filename, 'w') as f:
        json.dump(content, f, separators=(',',':'))