import zipfile
import xml.etree.ElementTree as ET

filepath = r'c:\Users\USER\Documents\Haid LMS Backend\TechLearn_LMS_SRS_v2.0.docx'
ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

with zipfile.ZipFile(filepath, 'r') as z:
    xml_content = z.read('word/document.xml')

root = ET.fromstring(xml_content)
paragraphs = []
for p in root.iter('{' + ns + '}p'):
    texts = []
    for t in p.iter('{' + ns + '}t'):
        if t.text:
            texts.append(t.text)
    line = ''.join(texts)
    if line.strip():
        paragraphs.append(line)

output = '\n'.join(paragraphs)
with open(r'c:\Users\USER\Documents\Haid LMS Backend\SRS_extracted.txt', 'w', encoding='utf-8') as f:
    f.write(output)

print("Done! Extracted", len(paragraphs), "paragraphs")
