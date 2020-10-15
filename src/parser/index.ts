import { parser } from './grammar.jison'

export const getNames = (s: string) => {
  const { lexer } = parser
  const variables = []

  lexer.setInput(s)

  let token
  do {
    token = lexer.lex()
    if (token === parser.symbols_.ID) {
      variables.push(lexer.yytext)
    }
  } while (token !== false && token !== lexer.EOF)

  return variables
}

export default (expr: string, context: any = {}) => {
  parser.yy.context = context
  return parser.parse(expr)
}
