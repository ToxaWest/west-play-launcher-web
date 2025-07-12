const bbCodeParser = (bbString: string) => {
    const content = bbString
        .replaceAll(/\n/gm, '')
        .replaceAll(/\r/gm, '')
        .replaceAll(/\[p](.*?)\[\/p]/gm, `<p>$1</p>`)
        .replaceAll(/\[url="(.*?)"](.*?)\[\/url]/gm, '<a href="$1" onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$2</a>')
        .replaceAll(/\[url=(.*?)](.*?)\[\/url]/gm, '<a href="$1" onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$2</a>')
        .replaceAll(/\[dynamiclink href="(.*?)"]\[\/dynamiclink]/gm, '<a href="$1" onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$1</a>')
        .replaceAll(/\[b](.*?)\[\/b]/gm, `<b>$1</b>`)
        .replaceAll(/\[h1](.*?)\[\/h1]/gm, `<h1>$1</h1>`)
        .replaceAll(/\[h2](.*?)\[\/h2]/gm, `<h2>$1</h2>`)
        .replaceAll(/\[h3](.*?)\[\/h3]/gm, `<h3>$1</h3>`)
        .replaceAll(/\[h4](.*?)\[\/h4]/gm, `<h4>$1</h4>`)
        .replaceAll(/\[h5](.*?)\[\/h5]/gm, `<h5>$1</h5>`)
        .replaceAll(/\[hr]\[\/hr]/gm, `<hr/>`)
        .replaceAll(/\[table](.*?)\[\/table]/gm, `<table>$1</table>`)
        .replaceAll(/\[tr](.*?)\[\/tr]/gm, `<tr>$1</tr>`)
        .replaceAll(/\[th](.*?)\[\/th]/gm, `<th>$1</th>`)
        .replaceAll(/\[td](.*?)\[\/td]/gm, `<td>$1</td>`)
        .replaceAll(/\[i](.*?)\[\/i]/gm, `<i>$1</i>`)
        .replaceAll(/\[u](.*?)\[\/u]/gm, `<u>$1</u>`)
        .replaceAll(/\[previewyoutube=(.*?);full]\[\/previewyoutube]/gm, `<iframe allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/$1?autoplay=0&amp;showinfo=0&amp;autohide=1&amp;fs=1&amp;modestbranding=1&amp;rel=0&amp;playsinline=1&amp;iv_load_policy=3&amp;controls=1&amp;enablejsapi=1&amp;widgetid=1"></iframe>`)
        .replaceAll(/\[previewyoutube="(.*?);full"]\[\/previewyoutube]/gm, `<iframe allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/$1?autoplay=0&amp;showinfo=0&amp;autohide=1&amp;fs=1&amp;modestbranding=1&amp;rel=0&amp;playsinline=1&amp;iv_load_policy=3&amp;controls=1&amp;enablejsapi=1&amp;widgetid=1"></iframe>`)
        .replaceAll(/\[quote](.*?)\[\/quote]/gm, `<quote>$1</quote>`)
        .replaceAll(/\[video mp4=(.*?) webm=(.*?) poster=(.*?) autoplay=(.*?) controls=(.*?)]\[\/video]/gm, `<video src="$2" loop=true autoplay=true muted=true style="max-width: 100%;" poster="$3"/>`)
        .replaceAll(/\[img](.*?)\[\/img]/gm, `<img src="$1" alt="" style="max-width: 100%;"/>`)
        .replaceAll(/\[img src="(.*?)"]\[\/img]/gm, `<img src="$1" alt="" style="max-width: 100%;"/>`)
        .replaceAll(/width="(.*?)"/gm, 'style="max-width: 100%;"')
        .replaceAll(/height="(.*?)"/gm, '')
        .replaceAll(/<img /gm, `<img onerror="this.style.display='none'" `)
        .replaceAll(/<a /gm, `<a onclick="event.preventDefault();window.api.openLink(event.target.href)" `)
        .replaceAll(/\{STEAM_CLAN_IMAGE}/gm, 'https://clan.fastly.steamstatic.com/images')
        .replaceAll(/\[carousel autoadvance="true"](.*?)\[\/carousel]/gm, '<div data-slider="true">$1</div>')
        .replaceAll(/\[carousel](.*?)\[\/carousel]/gm, '<div data-slider="true">$1</div>')
        .replaceAll(/\[list]/gm, '<ul>')
        .replaceAll(/\[\/list]/gm, '</ul>')
        .replaceAll(/\[olist]/gm, '<ol>')
        .replaceAll(/\[\/olist]/gm, '</ol>')

    const html = document.createElement('div');
    html.innerHTML = content;
    html.querySelectorAll('ul, ol').forEach(ul => {
        const temp = ul.innerHTML;
        const res = temp.split(new RegExp(`\\[\\*]`)).map(a => {
            if (a) return `<li>${a.replace(/\[\/\*]/gm, '')}</li>`
            return null;
        }).filter(a => a)
        ul.innerHTML = res.join('')
    })

    return html.innerHTML.replaceAll('\\[', '[');
}

export default bbCodeParser