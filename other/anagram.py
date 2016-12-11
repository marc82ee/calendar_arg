import sys


def main():

	# Input
	possible_anagrams = ['carthorse', 'crahtorse', 'aaa', 'bbbb', 'rochestrat' ]	
	word = raw_input("Plese enter the word to find anagrams for:").lower()
	
	# function call to get out the valid anagrams
	valid_anagrams = anagrams(word, possible_anagrams)
	print "Valid anagrams %s" %valid_anagrams



def anagrams (word , possible_anagrams):

	# We store the valid results here
	valid_anagrams = []	
	
	print "Possible anagrams of %s %s" %(word,possible_anagrams)

	word_length = len (word)	

	# loop over all the possible anagrams
	for anagram in possible_anagrams:		
		# reset counts and original word before taking a new anagram
		anagram_match_count = 0
		word_nomatch = word
		
		# Only words of same length can qualiify as anagrams
		if (len(word) == len (anagram)):
			# Loop over all characters of the anagram
			for c in anagram:				
				# Loop over all characters of the 'target' word
				for ch in word_nomatch:
					# If match, increase count and remove character (needs to appear exactly 1 time)
					if c == ch:						
						anagram_match_count +=1
						word_nomatch = word_nomatch.replace(ch,"")
						
			# If at the end of looping through the anagram count = length, all characters were matched exactly once -> add anagram
			if (anagram_match_count == word_length):
					valid_anagrams.append(anagram)
		

	return valid_anagrams

	#TODO: validate inputs
		
	
if __name__ == "__main__": main()
