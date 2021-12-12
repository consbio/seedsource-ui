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

  return variables.filter(v => v !== 'math_e')
}

export default (expr: string, context: any = {}) => {
  parser.yy.context = {
    ...context,
    math_e: Math.E,
  }
  console.log('...')
  console.log('parser.yy.context', parser.yy.context)
  console.log('???')
  console.log('parser.parse(expr)', parser.parse(expr))
  console.log('after parse')
  return parser.parse(expr)
}
