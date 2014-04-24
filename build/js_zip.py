######################
#JSC Javascript zipper
######################
#Step 3 of building JSC:
#   ZIPs up files into their respective places

import zipfile
import os

def run():
    print("4.1: Zipping core")
    zip(".buildtmp/js/core/", ".buildtmp/js/js_core")
    if os.path.exists(".buildtmp/js/extra/"):
        print("4.2: Zipping extra")
        zip(".buildtmp/js/extra/", ".buildtmp/js/js_extra")

def zip(src, dst):
    with zipfile.ZipFile("%s.zip" % (dst), "w", compression=zipfile.ZIP_STORED) as zf:
        abs_src = os.path.abspath(src)
        for dirname, subdirs, files in os.walk(src):
            for filename in files:
                absname = os.path.abspath(os.path.join(dirname, filename)).replace("\\", "/")
                arcname = absname[len(abs_src) + 1:]
                print('Zipping %s as %s' % (os.path.join(dirname, filename).replace("\\", "/"), arcname))
                zf.write(absname, arcname)
        zf.close()
