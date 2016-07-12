   Pwgen For BIOS
============================

About
---------------------------

This code is based on python programs from [Dogbert&#39;s Blog](http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html) and research by Asyncritus.

It can calculate recovery password for bios from a service tag hash.

Supported BIOS types:
* Compaq - 5 decimal digits
* Dell	- serial number for series -595B, -D35B. -2A7B and -1D3B
* Fujitsu-Siemens - 5 decimal digits, 8 hexadecimal digits, 5x4 hexadecimal digits, 5x4 decimal digits
* Hewlett-Packard - 5 decimal digits, 10 characters
* Insyde H20 (generic) - 8 decimal digits
* Phoenix (generic) - 5 decimal digits
* Sony - 7 digit serial number
* Samsung - 12 hexadecimal digits

For more information [read this](http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html).