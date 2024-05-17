/*
 * @Author: splendor fuyunzhishang@163.com
 * @Date: 2024-05-17 22:08:02
 * @LastEditors: splendor fuyunzhishang@163.com
 * @LastEditTime: 2024-05-17 22:37:24
 * @FilePath: \node-font-list\libs\win32\getByPowerShell.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * getByPowerShell
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec

// const parse = (str) => {
//   return str
//     .split('\n')
//     .map(ln => ln.trim())
//     .filter(f => !!f)
// }

const parse = (str) => {
  return str
    .split('\n')
    .map(ln => ln.trim())
    .filter(f => !!f)
    .reduce((acc, cur, idx, arr) => {
      if (idx % 2 === 0 && arr[idx + 1] === '-') {
        acc.push(`${cur} - ${arr[idx + 2]}`);
      }
      return acc;
    }, []);
}

/*
@see https://superuser.com/questions/760627/how-to-list-installed-font-families

  chcp 65001 | Out-Null
  Add-Type -AssemblyName PresentationCore
  $families = [Windows.Media.Fonts]::SystemFontFamilies
  foreach ($family in $families) {
    $name = ''
    if (!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'), [ref]$name)) {
      $name = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]
    }
    echo $name
  }
*/
module.exports = () => new Promise((resolve, reject) => {
  let cmd = `chcp 65001 | powershell -command "chcp 65001 | Out-Null; Add-Type -AssemblyName PresentationCore; Add-Type -AssemblyName PresentationFramework; $families = [Windows.Media.Fonts]::SystemFontFamilies; foreach ($family in $families) { $name = ''; if (!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'), [ref]$name)) { $name = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]; } $typeface = New-Object System.Windows.Media.Typeface($family, [System.Windows.FontStyles]::Normal, [System.Windows.FontWeights]::Normal, [System.Windows.FontStretches]::Normal); $glyphTypeface = $null; $typeface.TryGetGlyphTypeface([ref]$glyphTypeface) | Out-Null; $path = $glyphTypeface.FontUri.LocalPath; echo \"$name - $path\"; }`

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
    if (err) {
      reject(err)
      return
    }

    resolve(parse(stdout))
  })
})
