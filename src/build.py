import os
d=os.path.dirname(os.path.abspath(__file__))
rd=lambda f:open(os.path.join(d,f),encoding='utf-8').read()
js='\n'.join(rd(f+'.js').replace("'use strict';",'') for f in ['data1','data2','data3','data5a','data5b','data5c','data6a','data6b','data4','engine1','engine2','engine3','ui1','ui2','ui3','ui4','ui5'])
html='''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#07100c"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><meta name="description" content="Hollowroot: Rise of the Elven Realm. A deep idle kingdom-builder with creature bonding, branching story and prestige."><meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Hollowroot">
<title>Hollowroot: Rise of the Elven Realm</title>
<style>'''+rd('style.css')+'''</style></head>
<body><div id="app"><header id="top"><div id="res"></div><div id="sub"><span></span><span>🌳 Hollowroot</span></div></header><main id="view"></main></div>
<nav id="nav"></nav><div id="toasts"></div><div id="modal"></div>
<script>
"use strict";
'''+js+'''
</script></body></html>'''
open(os.path.join(d,'..','index.html'),'w',encoding='utf-8').write(html)
print(len(html))
