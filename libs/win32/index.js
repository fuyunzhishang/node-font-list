/*
 * @Author: splendor fuyunzhishang@163.com
 * @Date: 2024-05-17 22:08:02
 * @LastEditors: splendor fuyunzhishang@163.com
 * @LastEditTime: 2024-05-17 22:38:29
 * @FilePath: \node-font-list\libs\win32\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const os = require('os')
const getByPowerShell = require('./getByPowerShell')
const getByVBS = require('./getByVBS')

const methods_new = [getByPowerShell]
const methods_old = [getByVBS, getByPowerShell]

module.exports = async () => {
  let fonts = []

  // @see {@link https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js}
  let os_v = parseInt(os.release())
  let methods = os_v >= 10 ? methods_new : methods_old

  for (let method of methods) {
    try {
      fonts = await method()
      if (fonts.length > 0) break
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}
