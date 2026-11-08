"""Browser integration check. Requires Playwright and local Chromium; no runtime dependency."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, re, subprocess, sys, urllib.request, urllib.error, zipfile
ROOT = Path(__file__).resolve().parent
server = subprocess.Popen([sys.executable, '-u', str(ROOT / 'serve.py'), '--port', '8767', '--no-browser'], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
try:
    line = server.stdout.readline()
    match = re.search(r'http://127\.0\.0\.1:8767/\?token=[\w-]+', line)
    assert match, 'Developer server did not start'
    url = match.group(0)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1500, 'height':1100})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        page.wait_for_function("document.querySelector('#status').textContent.includes('Connected')", timeout=60000)
        for headers in [{}, {'Host':'attacker.invalid'}, {'Origin':'https://attacker.invalid'}]:
            target = url if headers else 'http://127.0.0.1:8767/'
            try:
                urllib.request.urlopen(urllib.request.Request(target, headers=headers))
            except urllib.error.HTTPError as error:
                assert error.code == 403
            else:
                raise AssertionError('Unpaired or foreign access accepted')
        game = page.frames[1]
        game.wait_for_selector('.game-nav')
        assert not game.locator('[data-view="studio"],[data-sandbox-max]').count()
        page.locator('[name="gold"]').fill('123456')
        page.locator('[name="food"]').fill('654321')
        page.locator('#apply').click()
        page.wait_for_function("document.querySelector('#status').textContent.includes('Applied')")
        game.wait_for_function("document.querySelector('#gold-value').textContent==='123,456' && document.querySelector('#res-food').textContent==='654,321'")
        response = page.evaluate("""async()=>{const token=new URLSearchParams(location.search).get('token'),frame=document.querySelector('iframe'),requestId='invalid-test';return await new Promise(resolve=>{function receive(e){if(e.source===frame.contentWindow&&e.data.requestId===requestId){removeEventListener('message',receive);resolve(e.data);}}addEventListener('message',receive);frame.contentWindow.postMessage({channel:'heavenly-mandate-dev-v1',token,requestId,action:'patch',patch:{gold:-1}},location.origin);});}""")
        assert not response['ok'] and 'Invalid' in response['error']
        page.locator('#undo').click()
        page.wait_for_function("document.querySelector('#status').textContent.includes('restored')")
        assert page.locator('[name="gold"]').input_value() == '0'
        with page.expect_download() as download:
            page.locator('#export').click()
        save = json.loads(Path(download.value.path()).read_text())
        assert save['commerce']['gold'] == 0
        # Test the same developer HTML without a bridge: import/edit/export only.
        offline = browser.new_page()
        offline.route('http://127.0.0.1:8767/offline', lambda route: route.fulfill(body=(ROOT/'Heavenly-Mandate-DevTools.html').read_text(),content_type='text/html'))
        offline.goto('http://127.0.0.1:8767/offline')
        offline.locator('#import').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(save).encode()})
        offline.wait_for_function("document.querySelector('#status').textContent.includes('validated')")
        offline.locator('[name="jade"]').fill('222222')
        offline.locator('#apply').click()
        with offline.expect_download() as edited:
            offline.locator('#export').click()
        assert json.loads(Path(edited.value.path()).read_text())['coins'] == 222222
        with zipfile.ZipFile(ROOT.parent/'Thien-Menh-Windows.zip') as archive:
            html = archive.read('Thien-Menh.html').decode()
            for forbidden in ['heavenly-mandate-dev-v1','data-sandbox-max','function sandboxMax']:
                assert forbidden not in html
        assert not errors, errors
        browser.close()
        print('Developer browser checks passed: live patch, invalid command, undo, export, offline import/edit/export, host/origin/token gates, production separation.')
finally:
    server.terminate()
    server.wait(timeout=10)
