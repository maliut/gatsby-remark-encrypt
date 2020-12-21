const AES = require(`crypto-js/aes`)

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.type === `MarkdownRemark`) {
    if (node.frontmatter.password) {
      actions.createNodeField({
        name: `encrypted`,
        node,
        value: true
      })
    }
  }
}