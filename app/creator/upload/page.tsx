"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  FileVideo,
  FileText,
  Check,
  AlertCircle,
  DollarSign,
  Camera,
  Mic,
  Film,
  // Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostActionState, Tcontent } from "@/lib/types/types";
import { createPost } from "@/app/action/post";
import { objectToFormData } from "@/lib/utils";
import Modal from "@/components/modal";

const categories = [
  "Photography",
  "Music Production",
  "Fitness",
  "Cooking",
  "Art & Design",
  "Technology",
  "Business",
  "Education",
  "Lifestyle",
  "Gaming",
  "Health & Wellness",
];

const contentTypes = [
  { id: "video", name: "Video Course", icon: FileVideo, description: "Upload video lessons" },
  { id: "live", name: "Live Session", icon: Camera, description: "Schedule live streaming" },
  { id: "podcast", name: "Podcast/Audio", icon: Mic, description: "Audio content only" },
  { id: "tutorial", name: "Tutorial Series", icon: Film, description: "Step-by-step guides" },
  { id: "ebook", name: "eBook/Guide", icon: FileText, description: "Written content" },
];

enum TSteps {
  CONTENT_TYPE,
  //   UPLOAD_FILES,
  CONTENT_DETAILS,
  PRICING_AND_SETTINGS,
  REVIEW_AND_PUBLISH,
}

export default function UploadContentPage() {
  const router = useRouter();
  //   const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<TSteps>(TSteps.CONTENT_TYPE);
  const [contentData, setContentData] = useState<Tcontent>({
    type: "",
    title: "",
    description: "",
    content: "",
    category: "",
    tags: [] as string[],
    price: "",
    originalPrice: "",
    // isPremium: false,
    // thumbnail: null as File | null,
    // visibility: "public", // public, private, unlisted
    // scheduledDate: "",
    estimatedDuration: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [postState, action, pending] = useActionState<PostActionState, FormData>(
    createPost.bind(null, contentData.tags),
    {
      status: "no_action",
    }
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  async function handleCreatePostAction() {
    action(objectToFormData(contentData));
  }
  // const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: unknown) => {
    setContentData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !contentData.tags.includes(tagInput.trim())) {
      setContentData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setContentData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // const handleSubmit = async () => {
  //   setIsUploading(true);
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   setIsUploading(false);

  //   // Redirect to creator dashboard
  //   router.push("/creator/dashboard?success=content-uploaded");
  // };

  useEffect(() => {
    if (postState.status === "success") {
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        router.push("/explore");
        setIsSuccessModalOpen(false);
      }, 4000);
    }
    if (postState.status === "error") {
      alert(postState.message || "An error occurred while uploading content.");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postState.status]);

  const stepTitles = [
    "Content Type",
    // "Upload Files",
    "Content Details",
    "Pricing & Settings",
    "Review & Publish",
  ];

  const progress = (currentStep / stepTitles.length) * 100;

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="bg-border h-6 w-px" />
            <div>
              <h1 className="font-semibold">Upload Content</h1>
              <p className="text-muted-foreground text-sm">
                Step {currentStep} of {stepTitles.length}: {stepTitles[currentStep - 1]}
              </p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href="/creator/dashboard">Save as Draft</Link>
          </Button>
        </div>
      </header>

      <form action={handleCreatePostAction} className="container mx-auto max-w-4xl px-4 py-8">
        {/* Progress Bar */}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                {stepTitles.map((title, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        index + 1 < currentStep
                          ? "bg-primary border-primary text-primary-foreground"
                          : index + 1 === currentStep
                            ? "border-primary text-primary bg-primary/10"
                            : "border-muted-foreground/30"
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="hidden md:block">{title}</span>
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === TSteps.CONTENT_TYPE && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Content Type</CardTitle>
              <CardDescription>Select the type of content you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contentTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`${type.id !== "ebook" ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:shadow-md"} transition-all ${
                      contentData.type === type.id ? "ring-primary bg-primary/5 ring-2" : ""
                    }`}
                    onClick={() => {
                      if (type.id === "ebook") handleInputChange("type", type.id);
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardContent className="p-6 text-center">
                          <type.icon className="text-primary mx-auto mb-4 h-12 w-12" />
                          <h3 className="mb-2 font-semibold">{type.name}</h3>
                          <p className="text-muted-foreground text-sm">{type.description}</p>
                        </CardContent>
                      </TooltipTrigger>
                      <TooltipContent
                        className={`${type.id === "ebook" && "hidden"} bg-blue-500 text-white`}
                      >
                        <p>
                          These options are not available yet, but will be integrated in the future
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === TSteps.CONTENT_DETAILS && (
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Add title, description, and other details about your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  placeholder="Enter a compelling title for your content"
                  value={contentData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description *</label>
                <textarea
                  name="description"
                  className="focus:ring-primary min-h-[120px] w-full resize-none rounded-md border p-3 focus:ring-2 focus:outline-none"
                  placeholder="Describe what learners will gain from your content..."
                  value={contentData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Content *</label>
                <textarea
                  name="content"
                  className="focus:ring-primary min-h-[120px] w-full resize-none rounded-md border p-3 focus:ring-2 focus:outline-none"
                  placeholder="Describe what learners will gain from your content..."
                  value={contentData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Category *</label>
                  <Select
                    required
                    name="category"
                    // className="focus:ring-primary w-full rounded-md border p-3 focus:ring-2 focus:outline-none"
                    value={contentData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className="focus:ring-secondary-500 w-full rounded-lg border bg-white py-2 pr-4 pl-10 text-sm text-gray-500 focus:border-transparent focus:ring-2 focus:outline-none">
                      <SelectValue className="" placeholder="Select a Category" />
                    </SelectTrigger>
                    {/* <option value="">Select a category</option> */}
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem className="focus:bg-blue-500" key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    {/* {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))} */}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Estimated Duration</label>
                  <Input
                    name="duration"
                    placeholder="e.g., 2h 30m, 45 minutes"
                    value={contentData.estimatedDuration}
                    onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="mb-2 flex gap-2">
                  <Input
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contentData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === TSteps.PRICING_AND_SETTINGS && (
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Settings</CardTitle>
              <CardDescription>Set your content pricing and visibility settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Original Price (NGN)</label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      type="number"
                      name="originalPrice"
                      placeholder="0.00"
                      className="pl-10"
                      value={contentData.originalPrice}
                      onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Leave empty or set to 0 for free content
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium"> Price (NGN)</label>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      className="pl-10"
                      value={contentData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Leave empty or set to 0 for free content
                  </p>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="text-sm font-medium">Revenue Share</h4>
                      <p className="text-muted-foreground text-sm">
                        Platform takes 10% commission on paid content. You keep 90% of all sales.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {currentStep === TSteps.REVIEW_AND_PUBLISH && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Publish</CardTitle>
              <CardDescription>Review your content before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Preview */}
              <div className="bg-muted/20 rounded-lg border p-6">
                <h3 className="mb-2 text-lg font-semibold">
                  {contentData.title || "Untitled Content"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {contentData.description || "No description provided"}
                </p>
                <p className="text-muted-foreground mb-4">
                  {contentData.content || "No content provided"}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">
                      {contentData.category || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Previous Price:</span>
                    <p className="text-muted-foreground">${contentData.originalPrice || "0.00"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Current Price:</span>
                    <p className="text-muted-foreground">${contentData.price || "0.00"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-muted-foreground">
                      {contentData.estimatedDuration || "Not specified"}
                    </p>
                  </div>
                  {/* <div>
                    <span className="font-medium">Files:</span>
                    <p className="text-muted-foreground">
                      {files.filter((f) => f.status === "completed").length} uploaded
                    </p>
                  </div> */}
                </div>

                {contentData.tags.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium">Tags:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {contentData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="font-medium">Publishing Checklist</h4>
                {[
                  { label: "Content title added", completed: !!contentData.title },
                  { label: "Description provided", completed: !!contentData.description },
                  { label: "Category selected", completed: !!contentData.category },
                  { label: "Content body added", completed: !!contentData.content },
                  { label: "Price set", completed: contentData.price !== "" },
                  //   {
                  //     label: "Files uploaded",
                  //     completed: files.some((f) => f.status === "completed"),
                  //   },
                  // { label: "Thumbnail uploaded", completed: !!contentData.thumbnail },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {item.completed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span
                      className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < stepTitles.length ? (
            <Button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(stepTitles.length, prev + 1))}
              disabled={
                currentStep === 1 && !contentData.type
                // || (currentStep === 2 && files.filter((f) => f.status === "completed").length === 0)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={
                pending ||
                !contentData.title ||
                !contentData.description ||
                !contentData.category ||
                !contentData.content
              }
            >
              {pending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Content
                </>
              )}
            </Button>
          )}
        </div>
      </form>
      <Modal
        isOpen={isSuccessModalOpen}
        hasCloseBtn={true}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <UploadSuccess />
      </Modal>
    </div>
  );
}

const UploadSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
        {/* Document morphing into checkmark */}
        <g className="animate-upload-morph">
          {/* Document shape */}
          <path
            d="M60 40 L140 40 L140 160 L60 160 Z"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="document-path"
          />
          <path
            d="M80 70 L120 70 M80 90 L120 90 M80 110 L100 110"
            stroke="#3b82f6"
            strokeWidth="2"
            className="document-lines"
          />
        </g>

        {/* Checkmark that appears */}
        <g>
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            className="check-circle"
          />
          <path
            d="M70 100 L90 120 L130 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-path"
          />
        </g>
      </svg>
      <p className="text-center text-lg font-semibold text-gray-700">
        Your post has been published successfully!
      </p>
      <p className="text-center">You will be redirected to the explore page shortly</p>
    </div>
  );
};
