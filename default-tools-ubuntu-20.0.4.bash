#!/bin/bash
# Starting with a plain / default image of ubuntu 20.04
# I apply these...
# file created feb 2022 

apt remove cups cups-browsed cups-core-drivers cups-daemon cups-server-common printer-driver-postscript-hp libfprint-2-tod1 evolution thunderbird 
add-apt-repository ppa:webupd8team/sublime-text-4
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list

apt install python3 python3-pip inkscape libreoffice vim vim-doc vim-scripts ctags apache2 npm php php-fpm php-curl php-gd php-cli postgresql postgresql-doc postgresql-doc-12 isag aspell ispell aptitude dia curl apt-transport-https sublime-text mc python-tz lynx libaspell-dev evince gimp net-tools sshd ssh ssh-askpass ghostscript git git-man git-daemon-run git-doc git-gui lsscsi
snap install chromium zoom-client signal-desktop opera spotify

a2enmod proxy_fcgi setenvif rewrite
systemctl reload apache2

echo 'version locked to node 14, update as new versions happen'
curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh
bash ./setup_14.sh 
apt install nodejs
npm -i --global npm

echo 'Add vscode as needed'


