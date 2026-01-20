import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(_req, { params }) {
  try {
    // In Next.js 15, params is a Promise
    const { issueId } = await params;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL environment variable" },
        { status: 500 }
      );
    }

    if (!supabaseAnonKey && !serviceKey) {
      return NextResponse.json(
        { error: "Missing Supabase API keys. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    // Use service role key if available, otherwise use anon key
    const supabase = createClient(
      supabaseUrl,
      serviceKey || supabaseAnonKey || ""
    );

    const bucket = "MRND mag";
    
    // First, verify the bucket exists and is accessible
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error("Error listing buckets:", bucketError);
    } else {
      const bucketExists = buckets?.some(b => b.name === bucket);
      console.log(`Bucket "${bucket}" exists: ${bucketExists}`);
      if (!bucketExists) {
        console.log("Available buckets:", buckets?.map(b => b.name));
      }
    }

    // If issueId is "root", list files from bucket root
    // Otherwise, try the folder first, then fall back to root
    let files = null;
    let folderPath = issueId === "root" ? "" : issueId;

    if (issueId === "root") {
      // List files directly from bucket root
      const { data: rootFiles, error: rootError } = await supabase.storage
        .from(bucket)
        .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

      if (rootError) {
        console.error("Supabase storage error:", rootError);
        return NextResponse.json(
          { error: rootError.message || "Failed to list files from bucket root", details: rootError },
          { status: 500 }
        );
      }

      files = rootFiles;
      console.log(`Found ${files?.length || 0} files in bucket root`);
    } else {
      // Try to list files in the issueId folder first
      const { data: folderFiles, error: folderError } = await supabase.storage
        .from(bucket)
        .list(issueId, { limit: 100 });

      if (folderError || !folderFiles || folderFiles.length === 0) {
        // If folder doesn't exist or is empty, try listing root
        const { data: rootFiles, error: rootError } = await supabase.storage
          .from(bucket)
          .list("", { limit: 100 });

        if (rootError) {
          return NextResponse.json(
            { error: rootError.message || "Failed to list files" },
            { status: 500 }
          );
        }

        files = rootFiles;
        folderPath = ""; // Files are in root
      } else {
        files = folderFiles;
      }
    }

    // Filter and sort images
    const images = (files ?? [])
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      )
      .map((file) => {
        const path = folderPath ? `${folderPath}/${file.name}` : file.name;
        // Get public URL - Supabase handles URL encoding automatically
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        const publicUrl = data.publicUrl;
        
        // Also try to create a signed URL as a fallback (but we'll use public first)
        // The public URL should work if the bucket policy is correct
        
        return { name: file.name, url: publicUrl };
      });

    console.log(`Filtered to ${images.length} images from ${files?.length || 0} total files`);

    if (images.length === 0) {
      return NextResponse.json(
        { 
          error: "No images found in bucket", 
          issueId, 
          images: [],
          debug: {
            totalFiles: files?.length || 0,
            fileNames: files?.map(f => f.name).slice(0, 10) || []
          }
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ issueId, images, count: images.length });
    // Add caching headers for faster subsequent loads
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (err) {
    console.error("Magazine API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

