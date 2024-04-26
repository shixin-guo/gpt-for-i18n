'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import { Pricing } from '@/config/pricing';
import {
  SupportedFileSuffix,
  code2Props,
  getPropsValue,
  isMarkdownFile,
  json2Props,
  matchRealKeys,
  props2Code,
} from '@/utils/convert';
import copyToClipboard from '@/utils/copyToClipboard';
import { getFileNameAndType } from '@/utils/fileUtils';
import { getTokenUsageForPage } from '@/utils/tokenUsage';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/ui/Layout';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CodeBlock,
  DownloadButton,
  LanguageShortKey,
  StartButton,
  Upload,
  languages,
} from '@/app/(1_Main)/_components';
export default function Home(): JSX.Element {
  const { data: session } = useSession();
  const [inputLanguage] = useState<LanguageShortKey>('en-US');
  const [outputLanguage] = useState<LanguageShortKey>('zh-CN');
  const [selectedLangs, setSelectedLangs] = useState<LanguageShortKey[]>([
    outputLanguage,
  ]);
  const [translatedLangs, setTranslatedLangs] = useState<LanguageShortKey[]>(
    [],
  );
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [isMaskVisible, setMaskVisible] = useState(true);
  const [isMaskVisible2, setMaskVisible2] = useState(true);

  const toggleMask = useCallback((visible: boolean) => {
    setMaskVisible((prevVisible) => visible ?? !prevVisible);
  }, []);
  const toggleMask2 = useCallback((visible: boolean) => {
    setMaskVisible2((prevVisible) => visible ?? !prevVisible);
  }, []);

  const uploadRef = useRef({
    name: '',
    type: '',
  });

  const translatedContentRef = useRef<{
    [key: string]: string;
  }>({});

  const tempInputCodePropsString = useRef('');

  const isSelectedAll = useMemo(() => {
    return selectedLangs.length === Object.keys(languages).length;
  }, [selectedLangs]);

  const disableStartButton = useMemo(() => {
    return !inputCode;
  }, [inputCode]);

  const multipleLanguagesWithStatus = useMemo(() => {
    return Object.values(languages)
      .filter((l) => l.shortKey !== inputLanguage)
      .map((language) => {
        const checked =
          isSelectedAll ||
          !![outputLanguage, ...selectedLangs].find(
            (l) => l === language.shortKey,
          );

        const disabled =
          isSelectedAll ||
          language.shortKey === inputLanguage ||
          language.shortKey === outputLanguage;
        return {
          ...language,
          shortKey: language.shortKey as LanguageShortKey,
          checked,
          disabled,
        };
      });
  }, [outputLanguage, inputLanguage, selectedLangs, isSelectedAll]);
  const handleUploadedFile = async (files: File[]) => {
    const file0 = files[0];
    if (file0) {
      const input = await file0?.text();
      setInputCode(input);
      uploadRef.current = getFileNameAndType(file0.name);
      toggleMask(false);
    }
  };
  // todo now only limit 1 month, should be updated to every month
  const checkTokenUsage = (usage: number) => {
    const isPro = !!session?.user?.stripePriceId || false;
    const limit = Pricing[isPro ? 'Pro' : 'Free'].tokenLimit;
    const isExceed = (session?.user.usage || 0) + usage > limit;
    if (isExceed) {
      toast.error('Usage exceeded the limit.', {
        description: 'Please upgrade your plan to continue.',
        position: 'top-center',
      });

      return false;
    }
    return true;
  };
  const handleTranslateCode = async ({
    exceptLang,
    content,
  }: {
    exceptLang: LanguageShortKey;
    content: string;
  }): Promise<void> => {
    const controller = new AbortController();
    const inputCodeProps = code2Props(
      content,
      uploadRef.current.type as SupportedFileSuffix,
    );
    tempInputCodePropsString.current = inputCodeProps;
    const inputCodePropsValue = getPropsValue(inputCodeProps);
    const usage = getTokenUsageForPage(JSON.stringify(inputCodePropsValue));
    if (!checkTokenUsage(usage)) {
      return;
    }
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        outputLanguage: exceptLang,
        inputCode: inputCodePropsValue,
        usage: usage,
      }),
    });

    if (!response.ok) {
      // setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;
    if (!data) {
      // setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (exceptLang === outputLanguage) {
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
      if (!translatedContentRef.current[exceptLang]) {
        translatedContentRef.current[exceptLang] = chunkValue;
      } else {
        translatedContentRef.current[exceptLang] += chunkValue;
      }
    }
    setTranslatedLangs((prevLangs) => [...prevLangs, exceptLang]);
  };
  const handleTranslateMD = async ({
    exceptLang,
    content,
  }: {
    exceptLang: LanguageShortKey;
    content: string;
  }): Promise<void> => {
    const controller = new AbortController();
    const usage = getTokenUsageForPage(JSON.stringify(content));
    if (!checkTokenUsage(usage)) {
      return;
    }
    const response = await fetch('/api/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        outputLanguage: exceptLang,
        inputCode: content,
        usage,
      }),
    });

    if (!response.ok) {
      // setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;
    if (!data) {
      // setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (exceptLang === outputLanguage) {
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
      if (!translatedContentRef.current[exceptLang]) {
        translatedContentRef.current[exceptLang] = chunkValue;
      } else {
        translatedContentRef.current[exceptLang] += chunkValue;
      }
    }
    setTranslatedLangs((prevLangs) => [...prevLangs, exceptLang]);
  };
  const handleTranslate = async (selectedLang: LanguageShortKey) => {
    setOutputCode('');
    if (isMarkdownFile(uploadRef.current.type)) {
      await handleTranslateMD({
        exceptLang: selectedLang,
        content: inputCode,
      });
    } else {
      await handleTranslateCode({
        exceptLang: selectedLang,
        content: inputCode,
      });
    }
  };
  const handleTranslateMultiLanguages = async (
    selectedLangs: LanguageShortKey[],
  ): Promise<void> => {
    if (
      !Object.values(SupportedFileSuffix).includes(
        uploadRef.current.type as SupportedFileSuffix,
      )
    ) {
      alert('Please upload a valid file.');
      return;
    }

    if (!inputCode) {
      // todo
      alert('Please enter some code.');
      return;
    }
    translatedContentRef.current = {};
    setLoading(true);
    setTranslatedLangs([]);

    Promise.all(
      selectedLangs
        .filter((l) => l !== inputLanguage)
        .map(async (selectedLang) => {
          await handleTranslate(selectedLang);
        }),
    )
      .then(() => {
        const fileType = uploadRef.current.type;
        if (
          !(
            fileType === SupportedFileSuffix.MARKDOWN ||
            fileType === SupportedFileSuffix.MARKDOWN_X
          )
        ) {
          Object.keys(translatedContentRef.current).map((shortKey) => {
            let outputCode = translatedContentRef.current[shortKey];
            if (outputCode) {
              const matchRealKeysResult = matchRealKeys(
                tempInputCodePropsString.current,
                outputCode,
              );
              const json2PropsResult = json2Props(matchRealKeysResult);
              outputCode = props2Code(
                json2PropsResult,
                uploadRef.current.type as SupportedFileSuffix,
              );
              translatedContentRef.current[shortKey] = outputCode;
            }
          });
        }
        setOutputCode(translatedContentRef.current[outputLanguage] || '');
        toggleMask2(false);
        copyToClipboard(outputCode);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setFinished(true);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="container flex h-full flex-col items-center px-4 pb-10 font-sans sm:px-10">
        <div className="mb-4 flex w-full flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="flex h-full flex-col justify-center space-y-2 sm:w-2/4">
            <div className="mt-4 flex h-8 items-center text-base font-bold leading-7">
              Original
            </div>
            <Tabs defaultValue="code">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start bg-transparent p-0">
                  <TabsTrigger
                    value="code"
                    className="text-muted-foreground data-[state=active]:text-foreground relative bg-transparent p-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="code" className="mt-0">
                <div className="relative min-h-[500px]">
                  {isMaskVisible && (
                    <>
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        {/* <Button
                          onClick={() => {
                            setInputCode('');
                            toggleMask(false);
                          }}
                        >
                          Create a Empty File
                        </Button> */}
                        <Upload onSuccess={handleUploadedFile} />
                      </div>
                    </>
                  )}
                  <CodeBlock
                    code={inputCode}
                    editable={!loading}
                    onChange={(value) => {
                      setInputCode(value);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="mt-4 flex h-8 items-center justify-between">
              <span className="text-base font-bold leading-7">Translation</span>
              {finished && (
                <div>
                  <StartButton
                    onClick={() => handleTranslateMultiLanguages(selectedLangs)}
                    loading={loading}
                    disabled={disableStartButton}
                  />
                  <DownloadButton
                    fileName={uploadRef.current.name}
                    fileType={uploadRef.current.type}
                    translatedContentRef={translatedContentRef}
                    disabled={loading || outputCode?.length === 0}
                    translatedLangs={translatedLangs}
                  />
                </div>
              )}
            </div>

            {/* todo zh-CN */}
            <Tabs defaultValue="zh-CN">
              <div className="flex items-center justify-between overflow-scroll">
                {/* todo memo */}
                {Object.values(multipleLanguagesWithStatus)
                  .filter((i) => i.checked)
                  .map((language) => {
                    return (
                      <TabsList
                        className="justify-start bg-transparent p-0"
                        key={language.shortKey}
                      >
                        <TabsTrigger
                          value={language.shortKey}
                          className="text-muted-foreground data-[state=active]:text-foreground relative w-full max-w-[6rem] justify-start bg-transparent p-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                        >
                          <span className="min-w-12">{language.name}</span>
                          <Cross1Icon className="ml-2" />
                        </TabsTrigger>
                      </TabsList>
                    );
                  })}
              </div>

              {Object.values(multipleLanguagesWithStatus)
                .filter((i) => i.checked)
                .map((language) => {
                  return (
                    <TabsContent
                      value={language.shortKey}
                      className="mt-0"
                      key={language.shortKey}
                    >
                      <div className="relative min-h-[500px]">
                        {isMaskVisible2 && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
                            <>
                              <>
                                <div className="mb-5 flex flex-wrap items-center justify-center">
                                  {Object.values(
                                    multipleLanguagesWithStatus,
                                  ).map((language) => {
                                    return (
                                      <div
                                        className="justify-space-evenly mt-2 flex items-center transition-all duration-200"
                                        key={language.shortKey}
                                      >
                                        <Checkbox
                                          id={`language-${language.shortKey}`}
                                          className="border-white"
                                          checked={language.checked}
                                          disabled={language.disabled}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedLangs((prev) => {
                                                return [
                                                  ...prev,
                                                  language.shortKey,
                                                ];
                                              });
                                            } else {
                                              setSelectedLangs((prev) =>
                                                prev.filter(
                                                  (key) =>
                                                    key !== language.shortKey,
                                                ),
                                              );
                                            }
                                          }}
                                        />
                                        <label
                                          className="w-48 pl-[8px] text-[16px] leading-none"
                                          htmlFor={`language-${language.shortKey}`}
                                        >
                                          {language.name}
                                          <span className="text-sm ">
                                            {' '}
                                            ({language.shortKey})
                                          </span>
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex flex-wrap items-center justify-start">
                                  <Switch
                                    defaultChecked={isSelectedAll}
                                    id="select-all-switch"
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedLangs(
                                          Object.keys(
                                            languages,
                                          ) as LanguageShortKey[],
                                        );
                                      } else {
                                        setSelectedLangs([
                                          inputLanguage,
                                          outputLanguage,
                                        ]);
                                      }
                                    }}
                                  />

                                  <label
                                    className="pl-[8px] text-[16px] leading-none "
                                    htmlFor="select-all-switch"
                                  >
                                    Select All
                                  </label>
                                </div>
                              </>
                            </>
                            <div className="mt-2 flex items-center space-x-2 ">
                              {
                                <StartButton
                                  disabled={disableStartButton}
                                  onClick={() =>
                                    handleTranslateMultiLanguages(selectedLangs)
                                  }
                                  loading={loading}
                                />
                              }
                            </div>
                          </div>
                        )}
                        <CodeBlock
                          code={
                            translatedContentRef.current?.[language.shortKey] ||
                            ''
                          }
                        />
                      </div>
                    </TabsContent>
                  );
                })}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

Home.Layout = Layout;
