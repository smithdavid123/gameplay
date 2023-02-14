#!/usr/bin/env sh

echo "添加文件..."
git add .
echo -n "提交备注...，请填写备注（可空）"
read remarks
if [ ! -n "$remarks" ];then
	remarks="fix"
fi
git commit -m "$remarks"
echo "提交代码..."
git push
echo "提交成功..."