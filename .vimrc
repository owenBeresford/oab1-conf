set nocp
set tw=0 ts=4 sw=4
" set enable ftplugin
set fdm=marker
syntax on
set hls
set enc=utf-8 fencs=utf-8,latin1 ff=unix
set mouse=a ruler spell
set backspace=indent,eol,start nobackup wildmode=longest,list

" maybe should add other possible file endings
if match(@%, ".js") >=0 
  source ~/.vim/plugin/js-doc.vim
  nnoremap <C-p> :call AddJSDoc()<CR>
endif
if match(@%, ".php") >=0 
  source ~/.vim/plugin/php-doc.vim
  nnoremap <C-p> :call PhpDocSingle()<CR>
endif

" s/"/“/
" imap <c-q>e s/"/”/

" http://en.wikipedia.org/wiki/Quotation_mark_glyphs
" '<'>s/"\([a-zA-Z]\)/“\1/g
" '<'>s/\([a-zA-Z]\)"/\1”/g

" http://vim.wikia.com/wiki/Faster_loading_of_large_files
" Protect large files from sourcing and other overhead.
" Files become read only
if !exists("my_auto_commands_loaded")
  let my_auto_commands_loaded = 1
  " Large files are > 10M
  " Set options:
  " eventignore+=FileType (no syntax highlighting etc
  " assumes FileType always on)
  " noswapfile (save copy of file)
  " bufhidden=unload (save memory when other file is viewed)
  " buftype=nowritefile (is read-only)
  " undolevels=-1 (no undo possible)
  let g:LargeFile = 1024 * 1024 * 10
  augroup LargeFile
    autocmd BufReadPre * let f=expand("<afile>") | if getfsize(f) > g:LargeFile | set eventignore+=FileType | setlocal noswapfile bufhidden=unload buftype=nowrite undolevels=-1 | else | set eventignore-=FileType | endif
    augroup END
  endif

