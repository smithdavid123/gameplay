<div style="margin: 10%; width: 80%; text-align: center; border: 1px solid #ccc; padding: 30px 0px 20px 0px">
<?php
	error_reporting(E_ERROR | E_PARSE);

function deleteDir($path) {
    if (is_dir($path)) {
        $dirs = scandir($path);
        foreach ($dirs as $dir) {
            if ($dir != '.' && $dir != '..') {
                $sonDir = $path.'/'.$dir;
                if (is_dir($sonDir)) {
                    deleteDir($sonDir);
                    @rmdir($sonDir);
                } else {
                    @unlink($sonDir);
                }
            }
        }
        @rmdir($path);
    }
}

	if ($_FILES["file"]["error"] > 0)
	{
		echo "错误：" . $_FILES["file"]["error"] . "<br>";
	}
	else
	{
		$extension = pathinfo($_FILES["file"]["name"])['extension'];
		$size = round($_FILES["file"]["size"] / 1024 / 1024, 2);
		if ($extension != 'ipa' && $extension != 'apk') {
			if ($extension == 'zip') {
				$fzip = "/usr/share/nginx/html/xinyong/app/pkg/dist.zip";
				if (file_exists($fzip)) {
					unlink($fzip);
				} 
					
				move_uploaded_file($_FILES["file"]["tmp_name"], $fzip);
				$outPath = "/usr/share/nginx/html/xinyong/app";
				$zip = new ZipArchive();
				$openRes = $zip->open($fzip);
				if ($openRes === TRUE) {
  	 				deleteDir($outPath."/dist");
					  $zip->extractTo($outPath);
					  $zip->close();
				}
				echo "OK";
		
			} else
				echo "Empty!";
			exit;
		} else if ($size > 20) {
			echo "文件太大，无法上传超过20M的文件！";
			exit;
		}
	    
		$file = "";
		if ($extension == 'ipa') {
			$file = "/usr/share/nginx/html/xinyong/down/IOS/IPA0430/xinyong.ipa";	
		} else if ($extension == 'apk') {
			$file = "/usr/share/nginx/html/xinyong/down/Android/xinyong.apk";	
		}
        if ($file == "") exit;
		
		if (file_exists($file)) {
			unlink($file);
		}
		if (1) {
			move_uploaded_file($_FILES["file"]["tmp_name"], $file);
			echo "文件大小: ". $size ."M, <label style='color: blue; margin-left: 10px'>上传成功！</label>";
		}
		
	}
?>
	<a href='index.html'><input type="submit" name="submit" style="width: 120px; height: 30px; 
		background-color: #fff; color: green; font: 16px; border: 1px solid green; cursor: pointer" 
		value="返回">
	</a>
</div>
