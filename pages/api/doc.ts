// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { NotionAPI } from 'notion-client'
import { Client } from '@notionhq/client'
import { get } from 'lodash'

const docNotion = new NotionAPI({})
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

async function fetchAllDocs() {
  const result = await notion.search({
    filter: {
      property: 'object',
      value: 'page',
    },
    sort: {
      timestamp: 'last_edited_time',
      direction: 'descending',
    },
  })
  return result
}

async function fetchDocByPath(path: string): Promise<string | null> {
  const { results } = await notion.search({
    filter: {
      property: 'object',
      value: 'database',
    },
  })

  for (let i = 0; i < results.length; i++) {
    console.log('search in table', i)
    // @ts-ignore
    const { id, properties } = results[i]
    if (!properties.path) {
      continue
    }
    const queryResult = await notion.databases.query({
      database_id: id,
      filter: {
        property: 'path',
        type: 'url',
        url: {
          equals: path,
        },
      },
      page_size: 1,
    })
    if (queryResult.results[0]) {
      return queryResult.results[0].id
    }
  }

  return null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const notionIdOrUrlPath = (req.query.id || '').toString()

  // 基于文章ID 或 path 查询详情
  if (notionIdOrUrlPath) {
    let notionId = notionIdOrUrlPath
    // 如果是 URL path，需要查询对应的 notion id
    if (
      !/^(\w|\d){8}/.test(notionIdOrUrlPath) ||
      notionIdOrUrlPath.length < 20
    ) {
      notionId = (await fetchDocByPath(notionIdOrUrlPath)) || ''
      if (!notionId) {
        throw Error('找不到 notion 页面')
      }
    }

    // 基于notion 查询用于渲染的结构对象详情（非官方API）
    // const recordMap = await docNotion.getPage(notionId);
    // const notionPage = await notion.pages.retrieve({
    //   page_id: notionId
    // });
    const [recordMap, notionPage] = await Promise.all([
      docNotion.getPage(notionId),
      notion.pages.retrieve({
        page_id: notionId,
      }),
    ])
    const properties = recordMap?.block[notionId]?.value?.properties
    const title = get(properties, 'title.0.0') || null
    // const description = get(properties, 'description.0.0') || null;
    // console.log(notionPage.properties,'notionPage')
    const path = get(notionPage, 'properties.path.url') || null
    const description =
      get(notionPage, 'properties.description.rich_text[0].plain_text') || null
    const keywords = (
      get(notionPage, 'properties.keywords.multi_select') || []
    ).map(function (item) {
      //@ts-ignore
      return item.name || ''
    })

    res.status(200).json({
      recordMap: recordMap,
      title: title,
      path: path,
      description: description,
      keywords: keywords,
    })
  } else {
    const result = await fetchAllDocs()
    return res.status(200).json({
      pages: result.results.map(function (item) {
        return {
          id: item.id,
          title: get(item, 'properties.title.title.0.plain_text') || null,
          // ...item,
        }
      }),
    })
  }
}
