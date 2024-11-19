import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CopyIcon, 
  CheckIcon, 
  CodeIcon, 
  LinkIcon, 
  MonitorIcon,
  RocketIcon 
} from 'lucide-react';

interface FormDeploymentProps {
  formId: number;
  formName: string;
}

export function FormDeployment({ formId, formName }: FormDeploymentProps) {
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [customDomain, setCustomDomain] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [copied, setCopied] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const formUrl = `${baseUrl}/forms/${formId}`;

  const embedCode = `<iframe
  src="${formUrl}"
  width="100%"
  height="600"
  frameborder="0"
  allowtransparency="true"
></iframe>`;

  const standaloneCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${formName}</title>
  <script src="${baseUrl}/form-embed.js"></script>
</head>
<body>
  <div id="survey-form" data-form-id="${formId}"></div>
</body>
</html>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    try {
      const response = await fetch('/api/deploy-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formId,
          customDomain: customDomain || undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDeploymentStatus('success');
        setDeployedUrl(data.url);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setDeploymentStatus('error');
      console.error('Deployment error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Deploy Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deploy">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deploy">
              <RocketIcon className="w-4 h-4 mr-2" /> Deploy
            </TabsTrigger>
            <TabsTrigger value="embed">
              <CodeIcon className="w-4 h-4 mr-2" /> Embed
            </TabsTrigger>
            <TabsTrigger value="standalone">
              <LinkIcon className="w-4 h-4 mr-2" /> Standalone
            </TabsTrigger>
            <TabsTrigger value="preview">
              <MonitorIcon className="w-4 h-4 mr-2" /> Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Custom Domain (Optional)</label>
                <Input
                  placeholder="form.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                className="w-full"
                onClick={handleDeploy}
                disabled={deploymentStatus === 'deploying'}
              >
                {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy to Vercel'}
              </Button>

              {deploymentStatus === 'success' && (
                <Alert>
                  <AlertDescription>
                    Deployed successfully! Your form is live at:<br />
                    <a 
                      href={deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {deployedUrl}
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Embed Code</label>
              <div className="relative mt-1">
                <textarea
                  readOnly
                  value={embedCode}
                  className="w-full h-32 p-2 font-mono text-sm border rounded"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(embedCode, 'embed')}
                >
                  {copied === 'embed' ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="standalone" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Standalone HTML</label>
              <div className="relative mt-1">
                <textarea
                  readOnly
                  value={standaloneCode}
                  className="w-full h-48 p-2 font-mono text-sm border rounded"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(standaloneCode, 'standalone')}
                >
                  {copied === 'standalone' ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-4">
              <iframe
                src={formUrl}
                width="100%"
                height="600"
                frameBorder="0"
                title="Form Preview"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}