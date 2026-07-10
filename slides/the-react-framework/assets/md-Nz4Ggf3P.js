import{H as e,L as t,T as n,X as r,Z as i,_ as a,_t as o,b as s,g as c,ht as l,x as u,y as d}from"./modules/shiki-kLq1Ixo7.js";import{nt as f,rt as p}from"./index-BsdVcuBg.js";import{t as m}from"./slidev/default-DfnjnygP.js";import{t as h}from"./slidev/CodeBlockWrapper-4bxGIiU3.js";var g={class:`mt-4`,border:`2 solid blue-800`,bg:`blue-800/20`,"rounded-lg":``,"px-4":``,"py-3":``},_={__name:`slides.md__slidev_5`,setup(_){let{$slidev:v,$nav:y,$clicksContext:b,$clicks:x,$page:S,$renderContext:C,$frontmatter:w}=p();return b.setup(),(p,_)=>{let v=h,y=e(`click`);return t(),a(m,o(n(l(f)(l(w),4))),{default:r(()=>[_[2]||=c(`h1`,null,`A Full Research ReAct Trace`,-1),_[3]||=c(`p`,null,`What does a multi-step agent actually look like?`,-1),u(v,{title:``,ranges:[]},{default:r(()=>[..._[0]||=[c(`pre`,{class:`shiki shiki-themes vitesse-dark vitesse-light slidev-code`,style:{"--shiki-dark":`#dbd7caee`,"--shiki-light":`#393a34`,"--shiki-dark-bg":`#121212`,"--shiki-light-bg":`#ffffff`}},[c(`code`,{class:`language-text`},[c(`span`,{class:`line`},[c(`span`,null,`Task: Find the top 5 most-downloaded Python packages. `)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`      Create a markdown table. Save as python_packages.md.`)]),s(`
`),c(`span`,{class:`line`},[c(`span`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Thought:     I'll need to search for current download statistics.`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Action:      web_search("most downloaded Python packages 2024 statistics")`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Observation: Result snippet mentions PyPI stats, numpy, requests...`)]),s(`
`),c(`span`,{class:`line`},[c(`span`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Thought:     Let me get more specific data from PyPI directly.`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Action:      web_search("PyPI top packages by downloads 2024 site:pypistats.org")`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Observation: numpy (900M/month), requests (800M), pip (750M), setuptools (700M), urllib3 (650M)`)]),s(`
`),c(`span`,{class:`line`},[c(`span`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Thought:     I have the data. Now I'll write the markdown table.`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Action:      write_file("python_packages.md", "# Top Python Packages\\n\\n| Rank | Package | Downloads/Month |\\n...")`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Observation: File written successfully at python_packages.md`)]),s(`
`),c(`span`,{class:`line`},[c(`span`)]),s(`
`),c(`span`,{class:`line`},[c(`span`,null,`Final Answer: Created python_packages.md with the top 5 packages.`)])])],-1)]]),_:1}),i((t(),d(`div`,g,[..._[1]||=[s(` 💡 Agent chose to do `,-1),c(`strong`,null,`two searches`,-1),s(` because the first wasn't specific enough. The plan adapted based on observations. `,-1)]])),[[y]])]),_:1},16)}}};export{_ as default};