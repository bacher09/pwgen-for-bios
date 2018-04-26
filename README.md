  Password generator for BIOS
================================
[![travis status][build-status]][travis]
[![coverage here][coverage-status]][coverage]
[![browserstack status][browserstack-status]][browserstack-info]

[![tested-browsers][sauce-matrix]][sauce-link]

This project contains master password generators for various BIOS/UEFI firmware.
For more info [read this][dogbert-post].

Latest released version available [here][bios-pw] and latest testing version (*synchronized with master branch*) [here][beta-bios-pw].

## Supported BIOS types:

* Asus &mdash; current BIOS date. For example: ``01-02-2013``
* Compaq &mdash; 5 decimal digits (*e.g*. ``12345``)
* Dell	&mdash; supports such series: ``595B``, ``D35B``, ``2A7B``, ``A95B``, ``1D3B``, ``6FF1`` and ``1F66``. *e.g*: ``1234567-2A7B`` or ``1234567890A-D35B`` for HDD.
* Fujitsu-Siemens &mdash; 5 decimal digits, 8 hexadecimal digits, 5x4 hexadecimal digits, 5x4 decimal digits
* Hewlett-Packard &mdash; 5 decimal digits, 10 characters
* Insyde H20 (Acer, HP) &mdash; 8 decimal digits
* Phoenix (generic) &mdash; 5 decimal digits
* Sony &mdash; 7 digit serial number
* Samsung &mdash; 12 hexadecimal digits

## More info

* http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html
* https://sites.google.com/site/hpglserv/Home/article

## Thanks

* [asyncritius](https://github.com/A-syncritus) &mdash; for major contribution to dell generator
* [dogbert](https://github.com/dogbert) &mdash; researched most of generators present here
* hpgl &mdash; for dell generator

[build-status]: https://api.travis-ci.org/bacher09/pwgen-for-bios.svg?branch=master
[travis]: https://travis-ci.org/bacher09/pwgen-for-bios
[coverage-status]: https://coveralls.io/repos/github/bacher09/pwgen-for-bios/badge.svg?branch=master
[coverage]: https://coveralls.io/github/bacher09/pwgen-for-bios?branch=master
[browserstack-status]: https://www.browserstack.com/automate/badge.svg?badge_key=UFl5WjA4TFlkNlN6MG1XTUd3Tmt6U1NzMXFYSHJLa2NsM3F0RE1JNnF3WT0tLWFJVEpCbVRlMVBJQ2dnRitWYVdnOFE9PQ==--785e0f4cd308caa52ec30b8183c16a6a6fc38293
[browserstack-info]: https://www.browserstack.com/automate/public-build/UFl5WjA4TFlkNlN6MG1XTUd3Tmt6U1NzMXFYSHJLa2NsM3F0RE1JNnF3WT0tLWFJVEpCbVRlMVBJQ2dnRitWYVdnOFE9PQ==--785e0f4cd308caa52ec30b8183c16a6a6fc38293
[sauce-matrix]: https://saucelabs.com/browser-matrix/bacher09.svg
[sauce-link]: https://saucelabs.com/u/bacher09
[dogbert-post]: http://dogber1.blogspot.com/2009/05/table-of-reverse-engineered-bios.html
[bios-pw]: https://bios-pw.org/
[beta-bios-pw]: https://beta.bios-pw.org/
