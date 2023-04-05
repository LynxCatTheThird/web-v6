@echo off
chcp 65001 > nul
echo 切换目录
cd /d themes/butterfly/
echo 重命名
ren .git.up .git
echo Pull
git pull
echo 重命名
ren .git .git.up
pause
exit

