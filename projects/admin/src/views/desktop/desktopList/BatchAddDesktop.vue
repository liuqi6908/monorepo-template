<script lang="ts" setup>
import moment from 'moment'
import { Notify } from 'quasar'
import { CSV_FILE_TYPE, isCsv, getRandomPassword } from 'zjf-utils'
import type { ICreateDesktopBodyDto } from 'zjf-types'
import { browser } from 'zjf-utils'

type CreateDesktopItem = Partial<Record<keyof ICreateDesktopBodyDto, string>>

const emits = defineEmits(['callback', 'loading'])

const { byAbsolute } = usePosition()

/** 展开菜单 */
const menu = ref(false)

const date = new Date()
const expiredDate = moment(date.setFullYear(date.getFullYear() + 1)).format('YYYY-MM-DD')

/**
 * 下载模板
 */
async function downloadTemplate() {
  emits('loading', true)
  const arr = [[
    '云桌面ID',
    '云桌面名称',
    'IP地址',
    '访问地址',
    '账号（随机生成，请按照实际值修改）',
    '密码（随机生成，请按照实际值修改）',
    '到期时间（默认1年，请按照实际值修改）',
  ]]
  try {
    const res = await getVMListApi()
    if (Array.isArray(res)) {
      arr.push(...res.map((v) => {
        const { uuid, name, ip } = v
        const accessUrl = `${ip}:6389`
        return [uuid, name, ip, accessUrl, `user-${name}`, getRandomPassword(), expiredDate]
      }))
      browser.downloadCsv(arr.map(v => v.join(',')).join('\n'), '批量添加云桌面')
    }
  }
  finally {
    emits('loading', false)
  }
}

/**
 * 批量添加云桌面
 */
async function batchAddDesktop(file: File) {
  if (!file)
    return

  if (!isCsv(file)) {
    Notify.create({
      color: 'danger',
      message: '只能上传 CSV 文件',
    })
    return
  }
  menu.value = false
  try {
    const content = await browser.readFile(file) as string
    const jsonArray = parseFileContent(content)

    const total = jsonArray.length
    let success = 0
    const error: Record<number, string> = {}

    const notify = Notify.create({
      type: 'loading',
      message: '正在上传中，请耐心等待...',
      caption: `上传进度：0 / ${total}`
    })
    for (let i = 0; i < total; i++) {
      try {
        const body = processingJSONData(jsonArray[i])
        await createDesktopApi(body, {
          headers: {
            notify: false,
          }
        })
        success++
      }
      catch (e: any) {
        const { message, detail } = e.response?.data ?? {}
        error[i + 1] =  detail?.[0]?.message ?? message ?? e.message ?? 'error'
      }
      finally {
        notify({
          caption: `上传进度：${i + 1} / ${total}`
        })
      }
    }
    showUploadResult(total, success, error, notify, () => emits('callback'))
  }
  catch (_) {
    Notify.create({
      color: 'danger',
      message: '文件内容读取失败',
    })
  }
}

/**
 * 解析 CSV 文件内容
 */
function parseFileContent(content: string) {
  const lines = content.split('\n')
  const headers: (keyof ICreateDesktopBodyDto)[] = [
    'id', 'name', 'internalIp', 'accessUrl',
    'account', 'password', 'expiredAt',
  ]
  const jsonArray: CreateDesktopItem[] = []
  for (let i = 1; i < lines.length; i++) {
    lines[i] = lines[i].trim().replace('\\r', '')
    if (lines[i]) {
      const line = lines[i].split(',').map(v => v.replace(/^"(.*)"$/, '$1').trim())
      const obj: CreateDesktopItem = {}
      for (let j = 0; j < headers.length; j++)
        obj[headers[j]] = line[j]
      jsonArray.push(obj)
    }
  }
  return jsonArray
}

/**
 * 处理 json 数据
 */
function processingJSONData(json: CreateDesktopItem): ICreateDesktopBodyDto {
  const {
    id, name, internalIp, accessUrl,
    account, password, expiredAt,
  } = json

  if (!id)
    throw new Error('云桌面ID不能为空')
  if (!name)
    throw new Error('云桌面名称不能为空')
  if (!internalIp)
    throw new Error('IP地址不能为空')
  if (!accessUrl)
    throw new Error('访问地址不能为空')
  if (!account)
    throw new Error('账号不能为空')
  if (!password)
    throw new Error('密码不能为空')

  return {
    id, name, internalIp, accessUrl, account, password,
    expiredAt: new Date(expiredAt || expiredDate),
  }
}
</script>

<template>
  <div rounded-2>
    <ZBtn
      label="批量添加云桌面"
      text-color="primary-1"
      :params="{
        outline: true,
      }"
    >
      <template #left>
        <div w5 h5 i-mingcute:add-line />
      </template>
      <template #icon>
        <div
          w5 h5 i-mingcute:down-line
          transition
          :style="{
            transform: menu ? 'rotate(180deg)' : 'rotate(0deg)',
          }"
        />
      </template>
    </ZBtn>
    <q-menu
      v-model="menu"
      id="batch-add-user-menu"
      class="more-menu"
      @before-show="byAbsolute('batch-add-user-menu', [0, 6])"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          w="176px!"
          @click="downloadTemplate"
        >
          <q-item-section>
            <div i-mingcute:download-3-line />
            下载模板
          </q-item-section>
        </q-item>
        <ZUpload
          :accept="CSV_FILE_TYPE.join(',')"
          :hint-message="{
            accept: '只能上传 CSV 文件'
          }"
          @update:model-value="val => batchAddDesktop(val)"
        >
          <q-item
            clickable
            w="176px!"
          >
            <q-item-section>
              <div i-mingcute:upload-3-line />
              上传CSV
            </q-item-section>
          </q-item>
        </ZUpload>
      </q-list>
    </q-menu>
  </div>
</template>
