const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
const codeHandler = require(`./code-handler`)
const AES = require(`crypto-js/aes`)

module.exports = ({ markdownNode, markdownAST }, pluginOptions = {}) => {

  if (markdownNode.frontmatter.password) {
    // ast to html: copied from gatsby-transform-remark
    const htmlAst = toHAST(markdownAST, {
      allowDangerousHTML: true,
      handlers: {
        code: codeHandler,
      },
    })
    const html = hastToHTML(htmlAst, {
      allowDangerousHTML: true,
    })

    // encrypt it use crypto-js
    const crypted = AES.encrypt(html, String(markdownNode.frontmatter.password)).toString()

    // replace all nodes into single encrypted text
    markdownAST.children = [{
      type: 'html',
      value: crypted,
    }]

    // don't know how to access and modify frontmatter in plugin
    // but as our test, you can simply modify it when key is exist
    // however add a new key in frontmatter is not supported
    markdownNode.frontmatter.password = true
  }

  return markdownAST
}