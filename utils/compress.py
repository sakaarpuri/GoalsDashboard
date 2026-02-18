#!/usr/bin/env python3
"""
Auto-compression utility for Mission Control
Optimizes images, PDFs, and assets for minimal VPS storage
"""

import os
import sys
from pathlib import Path

def optimize_image(input_path, output_path=None):
    """Convert image to WebP for 60-80% size reduction"""
    try:
        from PIL import Image
        
        img = Image.open(input_path)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
        
        # Save as WebP with good quality
        if not output_path:
            output_path = str(Path(input_path).with_suffix('.webp'))
        
        img.save(output_path, 'WEBP', quality=85, method=6)
        
        # Calculate savings
        original_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        savings = (1 - new_size / original_size) * 100
        
        print(f"✓ {Path(input_path).name}: {original_size/1024:.1f}KB → {new_size/1024:.1f}KB ({savings:.0f}% smaller)")
        return output_path
        
    except ImportError:
        print("⚠ Pillow not available, skipping image optimization")
        return input_path
    except Exception as e:
        print(f"✗ Error optimizing {input_path}: {e}")
        return input_path

def optimize_pdf(input_path, output_path=None):
    """Compress PDF by optimizing images within"""
    try:
        # For now, just check size and warn if large
        size = os.path.getsize(input_path)
        if size > 1024 * 1024:  # > 1MB
            print(f"⚠ Large PDF: {Path(input_path).name} ({size/1024/1024:.1f}MB)")
            print("  Tip: Reduce image resolution before generating PDF")
        else:
            print(f"✓ PDF OK: {Path(input_path).name} ({size/1024:.1f}KB)")
        return input_path
    except Exception as e:
        print(f"✗ Error checking {input_path}: {e}")
        return input_path

def clean_old_files(directory, days=30):
    """Archive files older than N days"""
    import time
    from datetime import datetime, timedelta
    
    cutoff = time.time() - (days * 86400)
    archived = 0
    
    for file_path in Path(directory).glob('*'):
        if file_path.is_file():
            mtime = os.path.getmtime(file_path)
            if mtime < cutoff:
                # Move to archive folder instead of deleting
                archive_dir = Path(directory) / 'archive'
                archive_dir.mkdir(exist_ok=True)
                
                new_path = archive_dir / file_path.name
                os.rename(file_path, new_path)
                archived += 1
    
    if archived:
        print(f"📦 Archived {archived} old files to {archive_dir}")

def get_workspace_stats():
    """Show storage usage breakdown"""
    workspace = Path('/data/.openclaw/workspace')
    
    total_size = 0
    by_ext = {}
    
    for file_path in workspace.rglob('*'):
        if file_path.is_file():
            size = os.path.getsize(file_path)
            total_size += size
            ext = file_path.suffix.lower() or 'no_ext'
            by_ext[ext] = by_ext.get(ext, 0) + size
    
    print("\n📊 Workspace Storage Stats:")
    print(f"Total: {total_size/1024/1024:.2f} MB")
    print("\nBy type:")
    for ext, size in sorted(by_ext.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {ext}: {size/1024:.1f} KB")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'stats':
            get_workspace_stats()
        elif sys.argv[1] == 'clean':
            clean_old_files('/data/.openclaw/workspace/outputs', days=30)
        else:
            # Optimize specific file
            path = sys.argv[1]
            if path.endswith(('.png', '.jpg', '.jpeg')):
                optimize_image(path)
            elif path.endswith('.pdf'):
                optimize_pdf(path)
    else:
        get_workspace_stats()
