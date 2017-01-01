" oab1 remake of the addJSDoc. Changes:
" * make compliant to Javadoc manual (strip @function and @name)
" * Make the comment below the name, its more readable
" * Fix function name parsing for object literal
" * Improve definition of a function name (allow _ and numbers)
" * LTB: a thing to understand types on return statement without using a JS parser
"
" _++ Original header ++
" https://gist.github.com/sunvisor/3903772
" JSDoc形式のコメントを追加(functionの行で実行する)
" hogeFunc: function() の形式と function hogeFunc() に対応
" 関数定義でない場合は、コメントだけ出力する
function! AddJSDoc()
    let l:jsDocregex = '\s*\([a-zA-Z_0-9]*\)\s*[:=]\s*function\s*(\s*\(.*\)\s*).*'
    let l:jsDocregex2 = '\s*function \+\([a-zA-Z_0-9]*\)\s*(\s*\(.*\)\s*).*'
    let l:jsDocregex3 = '*\.\([a-zA-Z_0-9]\).*'

    let l:line = getline('.')
    let l:indent = indent('.')
    let l:space = repeat(" ", l:indent)

    if l:line =~ l:jsDocregex
        let l:flag = 1
        let l:regex = l:jsDocregex
    elseif l:line =~ l:jsDocregex2
        let l:flag = 1
        let l:regex = l:jsDocregex2
    else
        let l:flag = 0
    endif

    let l:lines = []
    let l:desc = input('Description :')
    call add(l:lines, l:space. '/**')
    if l:flag
        let l:funcName = substitute(l:line, l:regex, '\1', "g")
        let l:funcName = substitute(l:funcName, l:jsDocregex3 , '\1', "g")
        let l:arg = substitute(l:line, l:regex, '\2', "g")
        let l:args = split(l:arg, '\s*,\s*')
        call add(l:lines, l:space . ' * ' . l:funcName)
		call add(l:lines, l:space . ' * ' . l:desc)
   "     call add(l:lines, l:space . ' * @function')
        for l:arg in l:args
            call add(l:lines, l:space . ' * @param ' . l:arg)
        endfor
        call add(l:lines, l:space . ' * @access public')
        call add(l:lines, l:space . ' * @return void')
    endif
    call add(l:lines, l:space . ' */')
    call append(line('.')-1, l:lines)
endfunction

