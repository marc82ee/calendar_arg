import sys


def main():

	# Input	

	start= int(raw_input("Plese enter the frog start position:"))
	jump_distance= int(raw_input("Plese enter the jump distance:"))
	end= int(raw_input("Plese enter the frog final position:"))

	# TODO: validate inputs
	
	# function call to get out the valid anagrams
	min_jump_number = frog(start, end, jump_distance)
	print "number of jumps %i" %min_jump_number


def frog (x , y, d):

	# We store the number of jumps here
	jumb_number = 0		
	
	# While frog hasnot reach yet the destination
	while (x < y):
		# Increase the position by a jump of distance
		x = x +d
		jumb_number +=1		

	return jumb_number        

	
if __name__ == "__main__": main()
	


