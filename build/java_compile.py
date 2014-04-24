##################
#JSC Java compiler
##################
#Step 4 of building JSC:
#   Downloads latest Bukkit
#   Compile Java files
#   Copy all files in src/java/dependencies to .buildtmp/java/
#   Copy plugin.yml to .buildtmp/java
#   Copy all .zip files to .buildtmp/java

import subprocess
import urllib.request
import urllib.parse
import os
import shutil

def run(conf):
    print("5.1: Looking for Craftbukkit")
    dlbukkit()
    print("5.2: Compiling JSC Java code")
    error = compilejava(conf)
    if error == True:
        return error
    print("5.3: Copying dependencies")
    copydeps()

def dlbukkit():
    url = "http://dl.bukkit.org/latest-dev/craftbukkit.jar"
    file_name = ".buildtmp/includes/bukkit.jar"
    if os.path.exists(file_name):
        print("5.1.1: Found.")
        return
    u = urllib.request.urlopen(url)
    f = open(file_name, 'wb')
    meta = u.info()
    file_size = int(meta["Content-Length"])
    print("5.1.1: Downloading: %s Bytes: %s" % (url, file_size))
    file_size_dl = 0
    block_sz = 300000
    while True:
        buffer = u.read(block_sz)
        if not buffer:
            break
        file_size_dl += len(buffer)
        f.write(buffer)
        status = r"%10d  [%3.2f%%]" % (file_size_dl, file_size_dl * 100. / file_size)
        print(status)
    f.close()

def compilejava(conf):
    classpath = [
        "src/java/dependencies/minjson.jar",
        ".buildtmp/includes/bukkit.jar"
    ]
    files = [
        "src/java/net/sq10/JSC/JSCPlugin.java",
        "src/java/net/sq10/JSC/AbstractCommand.java",
        "src/java/net/sq10/JSC/Metrics.java"
    ]
    directory = ".buildtmp/java/"
    classpathcount = 1
    ver = str(int(conf["java_version"]))
    if conf["force_java_version"] == True:
        cmdstr = "javac -source "+ver+" -target "+ver+" -d "+directory+" -classpath "
    else:
        cmdstr = "javac -d "+directory+" -cp '"
    if os.name == "nt":
        cpsep = ";"
    else:
        cpsep = ":"
    for cp in classpath:
        if len(classpath) == classpathcount:
            cmdstr += cp
        else:
            cmdstr += cp+cpsep
        classpathcount += 1
    cmdstr += "' "
    for fn in files:
        cmdstr += fn+" "
    print("Executing: "+cmdstr)
    try:
        child = subprocess.Popen(cmdstr, shell=True)
        streamdata = child.communicate()[0]
        ecode = child.returncode
        print("Exit code: "+str(ecode))
        if ecode != 0:
            return True
    except FileNotFoundError:
        print("Could not run 'javac': Do you have the JDK installed and in your PATH?")
        return True

def copydeps():
    for dirname, dirnames, filenames in os.walk('src/java/dependencies'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            shutil.copyfile(fullname, ".buildtmp/java/"+filename)
    shutil.copyfile("src/java/plugin.yml", ".buildtmp/java/plugin.yml")
    for dirname, dirnames, filenames in os.walk('.buildtmp/js/'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            name, ext = os.path.splitext(filename)
            if ext == ".zip":
                shutil.copyfile(fullname, ".buildtmp/java/"+filename)
    