stimuli <- read.csv(file="stimuli.csv",head=TRUE,sep=",")
images <- stimuli$Image.File
library(tools)
copyimages <- function (imagelist,...) {
setwd("../res/drawable")
file.remove(list.files(pattern=glob2rx("stimulus*")))
setwd("../../stimuli")
j <- 1
    for(i in imagelist) {
	if (file.exists(i)) {
		ext <- (file_ext(i))
		file.copy(i, paste("../res/drawable/stimulus_", j, "_nonpublic.", ext, sep=""), overwrite=TRUE)
	}
	j <- j + 1
    }
}
copyimages(images)

audio <- stimuli$Audio.File
copyaudio <- function (audiolist,...) {
setwd("../res/raw")
file.remove(list.files(pattern=glob2rx("stimulus*")))
setwd("../../stimuli")
j <- 1
    for(i in audiolist) {
	if (file.exists(i)) {
		ext <- (file_ext(i))
		file.copy(i, paste("../res/raw/stimulus_", j, "_nonpublic.", ext, sep=""), overwrite=TRUE)
	}
	j <- j + 1
    }
}
copyaudio(audio)

numberofstimuli <- length(images)
makexml <- function (numofstimuli,...) {
j <- 1
imgstimulus <- ""
audstimulus <- ""
xml1 <- "<?xml version='1.0' encoding='utf-8'?><resources><string-array name='image_stimuli'>"
xml2 <- "</string-array><string-array name='audio_stimuli'>"
xml3 <- "</string-array></resources>"
	for(i in 1:numofstimuli) {
		imgstimulus <- paste(imgstimulus, "<item>@drawable/stimulus_", j, "_nonpublic</item>",sep="")
		audstimulus <- paste(audstimulus, "<item>@raw/stimulus_", j, "_nonpublic</item>",sep="")		
		j <- j + 1	
	}
	xml <- paste(xml1, imgstimulus, xml2, audstimulus, xml3, sep="")
	return(xml)
}
stringsxml <- makexml(numberofstimuli)
fileConn<-file("stimuli.xml")
writeLines(c(stringsxml), fileConn)
close(fileConn)
file.copy("stimuli.xml", "../res/values/stimuli.xml", overwrite=TRUE)