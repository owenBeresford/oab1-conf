# vim: syn=python
# this is to be pasted into a project, its too small be an import
# not designed to be called lots of times

def createLog():
	import logging
	LOGFILE = os.sep.join([ 'var', 'log', 'oab1.log'])
# https://stackoverflow.com/questions/533048/how-to-log-source-file-name-and-line-number-in-python
	FORMAT = "%(asctime)-15s %(funcName)s # %(lineno)s %(message)s "
	logging.basicConfig(filename=LOGFILE, level=logging.DEBUG, format=FORMAT)
	return logging

# use as $obj.info... $obj.warn... $obj.debug... $onj.error...
# to get more detail on stack trace
# $obj.error('Ooops', exc_info=True)
