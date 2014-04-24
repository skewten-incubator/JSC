################
#JSC Jar builder
################
#Step 5 of building JSC:
#   Put everything into a jar

import subprocess
import os
import json

def run():
    print("6.1: Reading version.json")
    with open("src/version.json") as conf_file:
        conf = json.load(conf_file)
        conf_file.close()
    print("6.2: Running command.")
    cmdstr = "jar cf ../bin/jsc-"+conf["version"]+"-"+conf["suffix"]+"-"+conf["build"]+".jar "
    os.chdir(".buildtmp/java/")
    for dirname, dirnames, filenames in os.walk('./'):
        for filename in filenames:
            fullname = os.path.join(dirname, filename).replace("\\","/")
            cmdstr += " '"+fullname+"'"
    print("Executing: "+cmdstr)
    try:
        child = subprocess.Popen(cmdstr, shell=True)
        streamdata = child.communicate()[0]
        ecode = child.returncode
        print("Exit code: "+str(ecode))
    except FileNotFoundError:
        print("Could not run 'jar': Do you have the JDK installed and in your PATH?")
        return True
    os.chdir("../../")