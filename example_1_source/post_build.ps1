
$buildDir = "build"
$destDir = "../example_1"

if (Test-Path $destDir) { Remove-Item -Recurse -Force $destDir }
Move-Item -Path $buildDir -Destination $destDir

