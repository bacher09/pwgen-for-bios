  Password generator for BIOS
================================
[![github actions status][build-status]][tests]
[![coverage here][coverage-status]][coverage]

[![tested-browsers][sauce-matrix]][sauce-link]

This project contains master password generators for various BIOS/UEFI firmware.
For more info [read this][dogbert-post].

Latest released version available [here][bios-pw] and latest testing version (*synchronized with master branch*) [here][beta-bios-pw].

## Supported BIOS types:

* Asus &mdash; current BIOS date. For example: ``01-02-2013``
* Compaq &mdash; 5 decimal digits (*e.g*. ``12345``)
* Dell	&mdash; supports such series: ``595B``, ``D35B``, ``2A7B``, ``A95B``, ``1D3B``, ``6FF1``, ``1F66``, ``1F5A`` and ``BF97``, ``E7A8``. *e.g*: ``1234567-2A7B`` or ``1234567890A-D35B`` for HDD.
* Dell Insyde BIOS (Latitude 3540) &mdash; *e.g.* ``5F3988D5E0ACE4BF-7QH8602`` (``7QH8602`` &mdash; service tag).
* Fujitsu-Siemens &mdash; 5 decimal digits, 8 hexadecimal digits, 5x4 and 6x4 hexadecimal digits, 5x4 decimal digits
* Hewlett-Packard &mdash; 5 decimal digits, 10 characters
* Insyde H20 (Acer, HP) &mdash; 8 decimal digits, 10 decimal digits or HP `i ` (lowercase and uppercase) prefixed 8 digits.
* Phoenix (generic) &mdash; 5 decimal digits
* Sony &mdash; 7 digit serial number
* HP (AMI BIOS) &mdash; 8 hexadecimal digits (A code)
* Samsung &mdash; 12, 18 or 44 hexadecimal digits

## More info

* http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html
* https://web.archive.org/web/20180913211958/https://sites.google.com/site/hpglserv/Home/article

## Thanks

* [asyncritius](https://github.com/A-syncritus) &mdash; for major contribution to dell generator
* [dogbert](https://github.com/dogbert) &mdash; researched many generators present here
* hpgl &mdash; for initial dell generator
* [let-def](https://github.com/let-def) &mdash; for Acer Insyde 10 digit
* [polloloco](https://github.com/polloloco) &mdash; for FSI 6x4 hex (`203c-d001`)

[build-status]: https://github.com/bacher09/pwgen-for-bios/actions/workflows/build-test.yml/badge.svg
[tests]: https://github.com/bacher09/pwgen-for-bios/actions/workflows/build-test.yml
[coverage-status]: https://coveralls.io/repos/github/bacher09/pwgen-for-bios/badge.svg?branch=master
[coverage]: https://coveralls.io/github/bacher09/pwgen-for-bios?branch=master
[sauce-matrix]: https://saucelabs.com/browser-matrix/bacher09.svg
[sauce-link]: https://saucelabs.com/u/bacher09
[dogbert-post]: http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html
[bios-pw]: https://bios-pw.org/
[beta-bios-pw]: https://beta.bios-pw.org/
