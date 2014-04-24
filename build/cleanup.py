##################
#JSC Build cleaner
##################
#Step 6 of building JSC:
#   Place .jar file in respective directory
#   Clean up build environment

import shutil
def run(tmpdirs, cleanonly=False):
	if cleanonly == True:
		cleanup(tmpdirs)
		return
	print("7.1: Moving .jar")
	movejar()
	print("7.2: Cleaning up .buildtmp")
	cleanup(tmpdirs)

def movejar():
	shutil.rmtree("bin")
	shutil.move(".buildtmp/bin/", "./")

def cleanup(tmpdirs):
	#Count is there so we don't remove the first 2 dirs in tmpdirs.
	count = 1
	for tmpdir in tmpdirs:
		if count != 3:
			count += 1
			continue
		try:
			shutil.rmtree(tmpdir)
		except FileNotFoundError:
			pass