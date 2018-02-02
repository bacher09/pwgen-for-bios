#!/usr/bin/env python3
import re
import os
import boto3
import mimetypes
import argparse
import time


UPLOAD_ORDER = [
    (re.compile(r'.*\.html$'), -1)
]

CACHE_RULES = [
    (re.compile(r'.*\.html$'), "public, max-age=120"),
    (re.compile(r'^version-info\.txt$'), "public, max-age=60"),
    (re.compile(r'.*\.(css|js)$'), "public, s-maxage=31536000, max-age=86400")
]

DEFAULT_PRIORITY = 0
REMOVE_TIMEOUT = 60 * 2


def deployment_files(deploy_dir):
    for root, dirs, files in os.walk(deploy_dir):
        for filename in files:
            file_path = os.path.join(root, filename)
            yield os.path.relpath(file_path, start=deploy_dir)


def sorted_files(deploy_dir):
    "Returns files in right order"
    files = list(deployment_files(deploy_dir))
    match_rules = []

    def sort_key(filename):
        for pattern, priority in UPLOAD_ORDER:
            if pattern.match(filename):
                return (priority, filename)

        return (DEFAULT_PRIORITY, filename)

    files.sort(key=sort_key, reverse=True)
    return files


def file_options(file_name):
    mimetype, _ = mimetypes.guess_type(file_name)
    if mimetype is None:
        mimetype = 'application/octet-stream'

    extra_config = {
        'ContentType': mimetype
    }

    for pattern, value in CACHE_RULES:
        if pattern.match(file_name):
            extra_config['CacheControl'] = value
            break

    return extra_config


def remove_old(bucket, new_files):
    new_files_set = frozenset(new_files)
    removed_files = []

    for s3_object in bucket.objects.all():
        if s3_object.key not in new_files_set:
            removed_files.append(s3_object.key)
            print("Marked for remove: {}".format(s3_object.key))

    # TODO: check errors
    bucket.delete_objects(Delete={
        'Objects': [{'Key': key} for key in removed_files],
        'Quiet': True
    })
    print("Objects removed")


def update_site(deploy_dir, bucket_name, delete=False):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket_name)
    updated_files = sorted_files(deploy_dir)

    for file_name in updated_files:
        file_path = os.path.join(deploy_dir, file_name)
        extra = file_options(file_name)
        print("Uploading: {}".format(file_name))
        bucket.upload_file(file_path, file_name, extra)

    if delete:
        print("Wait for cache invalidation")  # till cache become old
        time.sleep(REMOVE_TIMEOUT)
        remove_old(bucket, updated_files)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Deploy site to s3')
    parser.add_argument('--delete', action='store_true', help="Remove old files")
    parser.add_argument("deploy_dir")
    parser.add_argument("s3_bucket")
    args = parser.parse_args()
    update_site(args.deploy_dir, args.s3_bucket, delete=args.delete)
    print("Done")
