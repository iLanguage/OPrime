stimuli <- read.csv(file="sample_stimuli.csv",head=TRUE,sep=",",blank.lines.skip=T)
images <- stimuli$Image.File
library(tools)
copyimages <- function (imagelist,...) {
	setwd("../res/drawable")
	file.remove(list.files(pattern=glob2rx("stimulus*")))
	setwd("../../stimuli")
	j <- 1
    for(i in imagelist) {
		#remove tabs and \n
		i <- gsub("\t","",i, fixed=TRUE) 
		i <- gsub("\n","",i, fixed=TRUE) 
		#if there is no jpeg or png or gif, add .jpg to the file
		if(!grepl(".jpg",i) && !grepl(".png",i) && !grepl(".gif",i)){
			i <- paste(i,".jpg", sep="")
		}
		print(i)
		if (file.exists(i)) {
			ext <- (file_ext(i))
			file.copy(i, paste("../res/drawable/stimulus_", j, "_nonpublic.", ext, sep=""), overwrite=TRUE)
			print("File copied to Android app")
		} else {
			print("File not found")
			print(i)
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
	#replace NA with silence.mp3
	i <- gsub("NA","silence.mp3",i, fixed=TRUE) 
	#if there is no mp3 or wav, add .mp3 to the file
	if(!grepl(".mp3",i) && !grepl(".wav",i)){
		i <- paste(i,".mp3", sep="")
	}

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