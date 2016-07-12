   Pwgen For BIOS
============================

    About
---------------------------
This code are based on python programs from [Dogbert&#39;s Blog](http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html) and research by Asyncritus.

It can calculate recovery password for bios from a service tag hash.

Supported BIOS
Compaq - 5 decimal digits	12345	pwgen-5dec.py
Windows binary
Dell	serial number	1234567-595B, 1234567-D35B. 1234567-2A7B, 1234567-2A7B
Fujitsu-Siemens	5 decimal digits	12345	pwgen-5dec.py
Windows binary
Fujitsu-Siemens	8 hexadecimal digits	DEADBEEF	pwgen-fsi-hex.py
Windows binary
Fujitsu-Siemens	5x4 hexadecimal digits	AAAA-BBBB-CCCC-DEAD-BEEF	pwgen-fsi-hex.py
Windows binary
Fujitsu-Siemens	5x4 decimal digits	1234-4321-1234-4321-1234	pwgen-fsi-5x4dec.py
Windows binary
Hewlett-Packard	5 decimal digits	12345	pwgen-5dec.py
Windows binary
Hewlett-Packard/Compaq Netbooks	10 characters	CNU1234ABC	pwgen-hpmini.py
Windows binary
Insyde H20 (generic)	8 decimal digits	03133610	pwgen-insyde.py
Windows binary
Phoenix (generic)	5 decimal digits	12345	pwgen-5dec.py
Windows binary
Sony	7 digit serial number	1234567	pwgen-sony-serial.py
Windows binary
Samsung	12 hexadecimal digits	07088120410C0000	pwgen-samsung.py
Windows binary

For more information [read this](http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html).