---
layout: layouts/blogpost.njk
title: Salmon Recipe
description: Code Breakdown of IOCCC28 Winner Salmon Recipe
date: 2025-12-23
---

Some time ago while scrolling YouTube shorts I stumbled upon an interesting piece of C code.

<img style="--maxw: 60%" class="center-img" src="/assets/posts/002/1.png" alt="Salmon recipe source code">

At first glance it looks like the program just prints the square of integers from 1 to 10. Instead it actually prints a simple grilled salmon recipe.

<img style="--maxw: 80%" class="center-img"  src="/assets/posts/002/2.png" alt="Salmon recipe output">

It was written by [Adrian Cable](https://www.linkedin.com/in/adrian-cable-91730221/) who became one of the winners of the 28th IOCCC (International Obfuscated C Code Contest) with this entry. When I first looked at the [source code in GitHub](https://github.com/ioccc-src/winner/blob/master/2024/cable2/prog.c) the only things suspicious to me were the pointer `salmon` and the macro `grill` that prints the values in the array. But the macro seems to be just defined and undefined immediately without any use. Where did the recipe text even come from then? Why can't I see the square of the numbers at all?

The page for the entry on IOCCC's website has some hints to get to the solution and there's a video giving a basic explanation, but I didn't know much about encodings or string literal prefixes so I still didn't know what was going on. It was my first time reading obfuscated code and this one looked interesting enough that I decided to dig deeper.

In this post I try to go through my thought process that led me to "solve" the program.

Going into this I had some knowledge about the following topics so I assume you also have some understanding or at least can research them yourself:
- Basic understanding of binary numbers, bytes and hexadecimal representation of bytes.
- Basic programming and C syntax knowledge.
- C macros, strings, pointers, traversing arrays with pointers.

Link to the IOCCC page of the entry - https://www.ioccc.org/2024/cable2/index.html

***You can find all the relevant links to files and pages at the bottom of the post.***



## Dispelling the illusion

This kind of obfuscated code, beside sometimes being hard to read, contains some kind of trick to hide its real behavior. Probably the first thing to do when trying to understand such code is to discover that trick. I'll be quick to admit here that I didn't discover the trick by myself. As this was my first experience with obfuscated code, when I first looked at the code I was completely lost.

Thankfully, on the IOCCC page of the entry there is a link to a [video on YouTube](https://www.youtube.com/watch?v=RMI5oT9U4vc) explaining the steps to de-obfuscate the code. The first hint they give is to use the `cat -v` command in Linux. If you're on Windows like me, you could maybe use the `Get-Content` command in PowerShell but it's a bit tricky if you're not experienced with it. I have Git Bash installed so that's what I used to run `cat -v` but in the end I found a much better alternative that helped me finally understand the contents of the source file as you'll see later.

`cat -v` prints the contents of a file to the terminal and uses a special encoding to display non-printing characters in a readable way. Running the command on the source file produces this output (I wrapped the contents of the string):

<div class="wrap">

```c
#include <stdio.h>

unsigned int    *salmon = U"M-sM- M-^AM-^SM-sM- M-^AM-%M-sM- M-^AM-!M-sM- M-^AM-3M-sM- M-^AM-/M-sM- M-^AM-.M-sM- M-^@M- M-sM- M-^AM-3M-sM- M-^AM-!M-sM- M-^AM-,M-sM- M-^AM--M-sM- M-^AM-/M-sM- M-^AM-.M-sM- M-^@M- M-sM- M-^AM-&M-sM- M-^AM-)M-sM- M-^AM-,M-sM- M-^AM-,M-sM- M-^AM-%M-sM- M-^AM-4M-sM- M-^AM-3M-sM- M-^@M- M-sM- M-^AM-7M-sM- M-^AM-)M-sM- M-^AM-4M-sM- M-^AM-(M-sM- M-^@M- M-sM- M-^AM-/M-sM- M-^AM-,M-sM- M-^AM-)M-sM- M-^AM-6M-sM- M-^AM-%M-sM- M-^@M- M-sM- M-^AM-/M-sM- M-^AM-)M-sM- M-^AM-,M-sM- M-^@M-,M-sM- M-^@M- M-sM- M-^AM-,M-sM- M-^AM-%M-sM- M-^AM--M-sM- M-^AM-/M-sM- M-^AM-.M-sM- M-^@M- M-sM- M-^AM-*M-sM- M-^AM-5M-sM- M-^AM-)M-sM- M-^AM-#M-sM- M-^AM-%M-sM- M-^@M-,M-sM- M-^@M- M-sM- M-^AM-'M-sM- M-^AM-!M-sM- M-^AM-2M-sM- M-^AM-,M-sM- M-^AM-)M-sM- M-^AM-#M-sM- M-^@M-,M-sM- M-^@M- M-sM- M-^AM-3M-sM- M-^AM-!M-sM- M-^AM-,M-sM- M-^AM-4M-sM- M-^@M-,M-sM- M-^@M- M-sM- M-^AM-!M-sM- M-^AM-.M-sM- M-^AM-$M-sM- M-^@M- M-sM- M-^AM-0M-sM- M-^AM-%M-sM- M-^AM-0M-sM- M-^AM-0M-sM- M-^AM-%M-sM- M-^AM-2M-sM- M-^@M-,M-sM- M-^@M- M-sM- M-^AM-4M-sM- M-^AM-(M-sM- M-^AM-%M-sM- M-^AM-.M-sM- M-^@M- M-sM- M-^AM-'M-sM- M-^AM-2M-sM- M-^AM-)M-sM- M-^AM-,M-sM- M-^AM-,M-sM- M-^@M- M-sM- M-^AM-/M-sM- M-^AM-6M-sM- M-^AM-%M-sM- M-^AM-2M-sM- M-^@M- M-sM- M-^AM--M-sM- M-^AM-%M-sM- M-^AM-$M-sM- M-^AM-)M-sM- M-^AM-5M-sM- M-^AM--M-sM- M-^@M- M-sM- M-^AM-(M-sM- M-^AM-%M-sM- M-^AM-!M-sM- M-^AM-4M-sM- M-^@M- M-sM- M-^AM-&M-sM- M-^AM-/M-sM- M-^AM-2M-sM- M-^@M- M-sM- M-^@M-4M-sM- M-^@M--M-sM- M-^@M-6M-sM- M-^@M- M-sM- M-^AM--M-sM- M-^AM-)M-sM- M-^AM-.M-sM- M-^AM-5M-sM- M-^AM-4M-sM- M-^AM-%M-sM- M-^AM-3M-sM- M-^@M- M-sM- M-^AM-0M-sM- M-^AM-%M-sM- M-^AM-2M-sM- M-^@M- M-sM- M-^AM-3M-sM- M-^AM-)M-sM- M-^AM-$M-sM- M-^AM-%M-sM- M-^@M- M-sM- M-^AM-5M-sM- M-^AM-.M-sM- M-^AM-4M-sM- M-^AM-)M-sM- M-^AM-,M-sM- M-^@M- M-sM- M-^AM-&M-sM- M-^AM-,M-sM- M-^AM-!M-sM- M-^AM-+M-sM- M-^AM-9M-sM- M-^@M- M-sM- M-^AM-!M-sM- M-^AM-.M-sM- M-^AM-$M-sM- M-^@M- M-sM- M-^AM-#M-sM- M-^AM-/M-sM- M-^AM-/M-sM- M-^AM-+M-sM- M-^AM-%M-sM- M-^AM-$M-sM- M-^@M- M-sM- M-^AM-4M-sM- M-^AM-(M-sM- M-^AM-2M-sM- M-^AM-/M-sM- M-^AM-5M-sM- M-^AM-'M-sM- M-^AM-(M-sM- M-^@M-.M-bM-^@M-^JM-bM-^@M-^@M-bM-^@M-^@is very yummy";

#define  grillM-sM- M-^AM-^A  ;while(putchar(*salmon++))
#undef   grill

#define M-sM- M-^AM-^A grillM-sM- M-^AM-^A
#undef   grill

int main() {M-sM- M-^AM-^A M-sM- M-^AM-^A
  for (int i = 1; i <= 10; i++) {
    printf("%d * %d = %d\n", i, i, i*i);
  }
}
```

</div>

You can see immediately that seemingly out of nowhere there are a lot of characters in the code you weren't able to see before. Currently it all seems like gibberish but if you look at the code again you can see a few things:

1. Most of the hidden characters are in the string.
2. What we thought was a macro named `grill` is actually `grillM-sM- M-^AM-^A` (the whitespace is actually part of the special encoding for the non-printing characters), so `#undef grill` does nothing here since `grill` has never been defined.
3. There is a second macro named `M-sM- M-^AM-^A` that just acts as an alias for the first macro.
4. First thing the main function does is invoke the second macro twice. From this we can somewhat understand how the salmon recipe appears in the output. The recipe text must be hidden in the string.

With this, the presenters in the YouTube video, after shortly explaining what the U prefix does, declared the mystery solved and moved on.



## The Problem

That short explanation was not enough for me and I was still left with a bunch of questions:

- What do the symbols in the string mean? How do you get the recipe text from that?
- What does the `U` prefix do? Cpp reference says it encodes the string contents with UTF32 but I had not idea what that meant exactly.
- The output type of prefixing a string with `U` is `char32_t` but the string is assigned to an `unsigned int` pointer. What does that even do?
- In the macro why does the semicolon come before the while loop?
- Why is the macro invoked twice in a row in the main function?
- What happens to the for loop in the main function?

I decided to focus on a single question at a time. Decoding the contents of the string seemed like a good place to start. It didn't depend on answering any of the other questions.



## Decoding the string contents

I knew already by researching the `cat -v` command that the gibberish in the output is a special encoding to display non-printable characters in terms of printable ASCII characters. Below is a simple method for decoding the pattern. You'll need to refer to an ASCII table:

You start with a 0,
`M-` means you need to add 128,
`^` means you need to subtract 64,
Add the following ASCII character's decimal value.

For example, `M-^A` means `128 - 64 + 65 = 129 (81 in hex)`;
`M- ` means `128 + 32 = 160 (A0 in hex)`

Okay, I could now decode the output but I still didn't understand if the decoded values were characters or just bytes, the values I was getting were outside the ASCII range so maybe each value is a non-printing character. But how does that even help me get to the actual recipe text? I thought of decoding the whole thing and looking at the bigger picture, but it was hard to read that mess and I had to do calculations for each value. It just wasn't fun.

Then I remembered that files can be read as an array of bytes, so why don't I just look directly at the bytes of the source file. Regular text editors don't show the bytes so I downloaded a hex editor and opened the file with it:

<img src="/assets/posts/002/3.png" alt="Beginning of source code in hex editor" class="center-img">

And this went on until the end of the file:

<img src="/assets/posts/002/4.png" alt="End of source code in hex editor" class="center-img">

Interesting, I could see some of the bytes directly translated to ASCII characters on the right side. I could also finally read the bytes hidden in the string, without any calculation or eyesore. My attention was now completely on those bytes. Immediately a pattern was apparent - sets of 4 bytes each starting with `F3 A0`. Toward the end of the string the pattern breaks and is replaced with a pattern of 3 bytes starting with `E2 80`. Finally, at the very end of the string I see the familiar `is very yummy` text.

After sitting with the view for a few minutes I finally realized what I was looking at. The default text encoding for text editors and compilers is UTF8, so the bytes must be the UTF8 encoded bytes of characters. I remembered something about UTF8 encoding having varying number of bytes depending on the Unicode code point of a character. After a quick search, I found this simple pattern to decode the bytes:

```
1 byte: 0xxxxxxx (ASCII characters 0-127)
2 bytes: 110xxxxx 10xxxxxx
3 bytes: 1110xxxx 10xxxxxx 10xxxxxx
4 bytes: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

Concatenate the x bits to get the Unicode code point.
```

So if I see a byte that starts with `0` in the binary representation, I know the byte is an ASCII character and I can directly look it up in an ASCII table. If I see a byte that starts with `110` in binary, I know that it's a 2-byte pattern so I need to take the next byte and convert both bytes to the Unicode code point using the decoding rules. Similarly, I can recognize if the byte I'm reading is part of a 3-byte pattern or a 4-byte pattern.

To start decoding I first needed to convert the bytes to binary format. Using a programming calculator is great for this job, Windows calculator has a very useful programmer mode. I don't have to convert each hex byte individually, I can just write multiple bytes in a row thanks to the convenient relationship between hex and binary formats. Here are the first 4 bytes:

<img src="/assets/posts/002/5.png" alt="The first 4 bytes in the Windows calculator app" class="center-img">

So the first byte is `11110011`. Looking at the decoding rules, I see that the first character was encoded with 4 bytes. Arrange the x bits to get the Unicode code point:

`011 100000 000001 010011 (E0053 in hex)`

A quick google tells me it's a character named "Tag Latin Capital Letter S". The first letter of the recipe text is an `S`. Suspicious. Decoding the next several characters reveals that similarly all the hidden characters are in fact "tag" characters of the actual characters in the recipe text. Almost there I guess, but how does the code even get the actual characters out of there? Also what happens to the `is very yummy` text at the end?



## The U prefix

According to the [cppreference page for string literals](https://en.cppreference.com/w/cpp/language/string_literal.html), the U string literal prefix encodes the characters in the string with UTF32. Compared to the other encodings, UTF32 encoding rules are pretty simple. Just take the Unicode code point of the character and add leading zeroes until you get 32 bits or 4 bytes. As such, all UTF32 encoded characters have the same 4 byte width, and decoding the bytes is easy as just reading them.

The type of the UTF32 encoded string is `const char32_t[]`. In the code, it is then assigned to an `unsigned int*` type. I don't know the underlying conversions but from debugging the code I know that getting the value `*salmon` gets you the Unicode code point of a character (not the individual bytes) contained in an `unsigned int`. It means that you can directly access the decimal value of the characters with `*salmon`. So now we know that the `putchar` in the while loop is going to take in the Unicode code points of the characters in the string.



## putchar

According to the [reference page for putchar](https://en.cppreference.com/w/c/io/putchar.html), the function accepts an integer parameter and returns an integer. The character is converted to `unsigned char` internally. This means that for our `unsigned int` values, only the last 8 bits are actually used when deciding what character to print. So for every 32-bit UTF32 character value, you can discard the first 24 bits and find out what character is going to be printed looking at the remaining 8 bits. Also the returned integer value contains only the 8 bits that get printed, not the original value of the character.

However, there is a slight problem. Programs use something called "code pages". They are similar to an ASCII table - they have a set of characters on them and they match each character with a unique number. The program printing characters then looks up the value in the code page to decide what character gets printed. The code page used differs from program to program. Sending a value of 278 may not print the same character on two different programs/systems.

<blockquote class="tip">
	If you have different shells installed, try passing in non-ASCII values into <code>putchar</code>. You'll probably get different results.
</blockquote>

Luckily, the ASCII characters are standard and have the same values in most of the existing code pages. So if the value you pass in to `putchar` has 0 for the 8th bit (from the right side), you can be confident you'll get the same character across different programs.

Also, looking at the decoded characters in our string, all the Unicode code points have 0 on the 8th bit from the right. So we don't have to worry about this problem. All the characters printed are ASCII characters.

So now it's clear where the recipe text is actually coming from. But why does `is very yummy` not get printed? Also why does the recipe get printed only once, despite the macro being called twice?



## The premature semicolon

If you substitute the macro invocations in the main function with the actual code of the macro, you get this:

```c
int main() {;while(putchar(*salmon++)) ;while(putchar(*salmon++))
  for (int i = 1; i <= 10; i++) {
    printf("%d * %d = %d\n", i, i, i*i);
  }
}
```

Once you notice that there is nothing (just a new line) between the second while loop and the for loop, you can see that the for loop is actually nested inside the second while loop. So you could rewrite the main function like this:

```c
int main() {
  ;
  while(putchar(*salmon++));
  while(putchar(*salmon++)) {
    for (int i = 1; i <= 10; i++) {
      printf("%d * %d = %d\n", i, i, i*i);
    }
  }
}
```

`while(putchar(*salmon++)` is an example of a classic pattern in C used to print a string. It relies on the return value of `putchar`; the function needs to return 0 at some point for the loop to break.

For everyday use of the pattern, when the compiler allocates a character array for a string literal, it appends a NULL character (which has a value of 0) to the end of the array. The NULL character then acts as a stopping point for the loop. However, since the `is very yummy` text isn't printed in the output of the code, there probably is something between the recipe text and `is very yummy`.

If you look at the end of the string in the hex editor, just before `is very yummy` you can see three 3-byte UTF8 characters. Decoding the bytes you get:

```
E2 80 8A - 0010 000000 001010
E2 80 80 - 0010 000000 000000
E2 80 80 - 0010 000000 000000
```

Last 8 bits of the first character is a line feed character (LF), last 8 bits of the second and third character is a NULL character. This means that after the recipe text `putchar` goes to a new line. Convenient for keeping the terminal readable.

Since the return value of `putchar` is the value of the actual printed character, and not the character passed in as a parameter, it means that to break the loop it is enough for the last 8 bits of `*salmon` to be 0. So despite the two characters after the new line not being a NULL character, they still allow the while loop to break.

Why two NULL characters? Remember that the `salmon` pointer is incremented in the while loop:

`while(putchar(*salmon++))`

So after printing the recipe text and going to a new line, `putchar` prints the first NULL character, the pointer moves to the second NULL character, `putchar` returns 0 and the first while loop breaks. When the second while loop tries to start, `putchar` prints the second NULL character, returns 0 and the second while loop breaks without printing anything else or even going into the for loop. That's why the square of the numbers don't even get printed.



## Summary

In hindsight, the program is pretty simple - the contents of the string are encoded with UTF32, and only the last 8 bits of each character are taken by `putchar`, which then outputs the recipe text. In theory, any other invisible character would work here as long as the last 8 bits match. I think the fact that the author picked "tag" characters corresponding to the actual recipe text is result of a convenient coincidence.

That said, even if you know the intricacies of the C language, to understand the program you need to be able to de-obfuscate it first. And that's not an easy thing if your eyes and instincts aren't trained for it. Luckily, I didn't have to de-obfuscate much in this case. Still, it was a good opportunity to learn more about the language. Experience with the encodings was a nice bonus too.


<blockquote class="tip">
    Try making this change in the code and read the output. Do you understand why you get that result?

```diff
- unsigned int    *salmon = U"string contents";
+ unsigned short    *salmon = u"string contents";
```

</blockquote>

---

## Links

- LinkedIn page of the author, Adrian Cable
  - [https://www.linkedin.com/in/adrian-cable-91730221/](https://www.linkedin.com/in/adrian-cable-91730221/)

- Source code on GitHub
  - [https://github.com/ioccc-src/winner/blob/master/2024/cable2/prog.c](https://github.com/ioccc-src/winner/blob/master/2024/cable2/prog.c)

- IOCCC page of the entry
  - [https://www.ioccc.org/2024/cable2/index.html](https://www.ioccc.org/2024/cable2/index.html)

- *IOCCC28 - 2024/cable2 - Prize in murky waters* by Our Favorite Universe
  - [https://www.youtube.com/watch?v=RMI5oT9U4vc](https://www.youtube.com/watch?v=RMI5oT9U4vc)

- Language reference page for string literals
  - [https://en.cppreference.com/w/cpp/language/string_literal.html](https://en.cppreference.com/w/cpp/language/string_literal.html)

- Language reference page for putchar
  - [https://en.cppreference.com/w/c/io/putchar.html](https://en.cppreference.com/w/c/io/putchar.html)

- <a href="/assets/posts/002/utf8-decode.txt" download>Fully decoded string - download</a>