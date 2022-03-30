
Copyright (C) Korey Hinton 2022


# DISCLAIMER

This program is in no way meant to convert every filepath correctly to xml and vice versa, so no guarantees are given.

The purpose of why I created this was to be able to store data with a food
chain hierarchical structure in a clean file path structure.

While these programs will allow converting between the path
form and xml form and any xml-disallowed characters will attempted to be
encoded in the xml form, when presenting xml form in a xml tree
viewer it will repeat nodes that have a same named sub-component but differs
in the ancestor path components. If food chain data is desired, a
straightforward approach would be to overlay the duplicates as is shown/done in
the demo.

# LICENSE

GNU AFFERO GENERAL PUBLIC LICENSE Version 3

(see COPYING file)

# REQUIREMENTS

python 3

# INFO

Every path component converted to xml gets its own xml element tag.

Everything is simply just a tag, there is not xml tag content nor xml
attributes.

# DEMO

The food chain (found in demo/index.html) is based on data found at
https://prezi.com/xvjzl8obhmje/atlantic-rainforest-food-web/

This demo shows file path structure to store the data can be parsed directly
from path-like structured strings, and by overlapping similarly named
(repeated) nodes, a food chain hierarchical graph can be displayed.

![](demo/demo.png?raw=true) 

# EXAMPLES

The find command is a great way to quickly send test data through these
programs.

```sh
find /var -name "*" | paths2xml  # see the XML
find /var -name "*" | paths2xml | xml2paths  # convert back to PATHs

find /var -name "*" | paths2xml --compress  # see the compressed XML
find /var -name "*" | paths2xml -c  # see the compressed XML

find /var -name "*" | paths2xml | xml2paths --intermediate  # include
                                                            # intermediate paths
find /var -name "*" | paths2xml | xml2paths --i  # include intermediate paths
```
