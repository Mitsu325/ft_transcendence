import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqikvrjeixydnpedtjvo.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxaWt2cmplaXh5ZG5wZWR0anZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDg0NTYzNywiZXhwIjoyMDIwNDIxNjM3fQ.yucqzI7SLWFbrrvxh7jrb5-TdmQtmguvq5kt5qoawF0';

@Injectable()
export class UploadFileService {
    private supabase;

    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
            },
        });
    }

    async uploadStorage(
        bucket: string,
        fileName: string,
        file: Express.Multer.File,
    ) {
        const { data: uploadData, error }: any = await this.supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                upsert: true,
            });
        if (error) throw error;
        const { data } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(uploadData.path);
        return { ...data };
    }
}
