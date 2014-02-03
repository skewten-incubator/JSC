#JSC Builder v1
#Ugly edition

import subprocess
import os
import distutils
import shutil
import zipfile

newpath = os.path.dirname(__file__)
print("Changing directory to "+str(newpath))
os.chdir(newpath)

oldpath = newpath
def zipdir(dirPath=None, zipFilePath=None):
	os.chdir(dirPath)
	subprocess.Popen(oldpath+"/build/lib/7z/7za.exe a -tzip "+oldpath+"/"+zipFilePath+" ./* ").wait()
	os.chdir(oldpath)

status = ""
if not os.path.exists("build"):
	print("Error: build directory doesn't exist!")
	status = "NOFILE"
if not os.path.exists("build/tmp"):
	os.makedirs("build/tmp")
if os.path.isfile("build/jsc.jar"):
	os.remove("build/jsc.jar")
if status == "NOFILE":
	raise Exception("Could not find the required files/directories")
else:
	print("Building.");
	try:
		subprocess.Popen("java -jar build/lib/ecj.jar -1.7 -classpath build/lib/bukkit.jar java/net/sq10/JSC/JSCPlugin.java java/net/sq10/JSC/Metrics.java -d build/tmp").wait()
		print("Copying plugin.yml")
		shutil.copyfile("java/plugin.yml", "build/tmp/plugin.yml")
		print("Making jsc_core.zip")
		zipdir("javascript/core", "build/tmp/jsc_core.zip")
		print("Making jsc_extra.zip")
		zipdir("javascript/extra", "build/tmp/jsc_extra.zip")
		print("Making jsc.jar")
		zipdir("build/tmp", "build/jsc.jar")
		print("Cleaning up...")
		shutil.rmtree("build/tmp")
		print("Done! The compiled file is now in build/jsc.jar")
	except Exception as e:
		print("An error occured!");
		print(e);

input("Press enter to continue...");