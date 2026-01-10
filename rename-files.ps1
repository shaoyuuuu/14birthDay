$ErrorActionPreference = "Stop"

$memoryDir = "public\memory"

$folderMappings = @{
    "七七八八" = "qiqibaba"
    "乐山" = "leshan"
    "华尖山" = "huajianshan"
    "大二普" = "daerpu"
    "天府艺术馆" = "tianfu-art-gallery"
    "娘娘山" = "niangniangshan"
    "打铁花" = "datiehua"
    "植物园" = "botanical-garden"
    "烛光晚餐" = "candlelight-dinner"
    "白海子" = "baihaizi"
    "阿尔沟" = "aergou"
    "青城山" = "qingchengshan"
}

$imageMappings = @{
    "微信图片_2026-01-04_173254_818.jpg" = "memory-001.jpg"
    "微信图片_2026-01-04_173254_818 - 副本.jpg" = "memory-002.jpg"
    "微信图片_2026-01-04_173254_818 - 副本 (2).jpg" = "memory-003.jpg"
    "微信图片_2026-01-04_173319_877.jpg" = "memory-004.jpg"
    "微信图片_2026-01-04_173319_877 - 副本.jpg" = "memory-005.jpg"
    "微信图片_2026-01-04_173319_877 - 副本 - 副本.jpg" = "memory-006.jpg"
    "微信图片_2026-01-04_173319_877 - 副本 (2).jpg" = "memory-007.jpg"
    "freeimagecompression.com_DSC_3448.jpg" = "memory-001.jpg"
    "freeimagecompression.com_DSC_3522.jpg" = "memory-002.jpg"
    "freeimagecompression.com_DSC_3534.jpg" = "memory-003.jpg"
    "freeimagecompression.com_DSC_3680.jpg" = "memory-004.jpg"
    "freeimagecompression.com_DSC_3703.jpg" = "memory-005.jpg"
    "freeimagecompression.com_微信图片_20250913233803_7_3034.jpg" = "memory-006.jpg"
    "freeimagecompression.com_微信图片_2026-01-04_173254_818.jpg" = "memory-007.jpg"
    "freeimagecompression.com_微信图片_2026-01-04_173319_877.jpg" = "memory-008.jpg"
}

Write-Host "🚀 开始重命名文件和文件夹..." -ForegroundColor Green

foreach ($chineseFolder in $folderMappings.Keys) {
    $englishFolder = $folderMappings[$chineseFolder]
    $folderPath = Join-Path $memoryDir $chineseFolder
    
    if (Test-Path $folderPath) {
        Write-Host "`n📁 处理文件夹: $chineseFolder -> $englishFolder" -ForegroundColor Cyan
        
        $files = Get-ChildItem -Path $folderPath -File
        
        foreach ($file in $files) {
            if ($imageMappings.ContainsKey($file.Name)) {
                $newName = $imageMappings[$file.Name]
                $oldPath = $file.FullName
                $newPath = Join-Path $folderPath $newName
                
                if (Test-Path $newPath) {
                    Write-Host "  ⚠️  跳过已存在的文件: $newName" -ForegroundColor Yellow
                } else {
                    Rename-Item -Path $oldPath -NewName $newName
                    Write-Host "  ✅ 重命名: $($file.Name) -> $newName" -ForegroundColor Green
                }
            }
        }
        
        $newFolderPath = Join-Path $memoryDir $englishFolder
        if (Test-Path $newFolderPath) {
            Write-Host "  ⚠️  跳过已存在的文件夹: $englishFolder" -ForegroundColor Yellow
        } else {
            Rename-Item -Path $folderPath -NewName $englishFolder
            Write-Host "  ✅ 重命名文件夹: $chineseFolder -> $englishFolder" -ForegroundColor Green
        }
    }
}

Write-Host "`n✅ 文件和文件夹重命名完成！" -ForegroundColor Green
Write-Host "`n下一步:" -ForegroundColor Yellow
Write-Host "1. 运行: node rename-to-english.js" -ForegroundColor White
Write-Host "2. 运行: git add ." -ForegroundColor White
Write-Host "3. 运行: git commit -m '重命名文件为英文'" -ForegroundColor White
Write-Host "4. 运行: git push" -ForegroundColor White
