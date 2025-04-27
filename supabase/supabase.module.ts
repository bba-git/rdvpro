import \{ Module, Global \} from '@nestjs/common';\
import \{ createClient \} from '@supabase/supabase-js';\
import \{ ConfigModule, ConfigService \} from '@nestjs/config';\
\
const SupabaseProvider = \{\
  provide: 'SUPABASE_CLIENT',\
  useFactory: (configService: ConfigService) => \{\
    return createClient(\
      configService.get<string>('SUPABASE_URL'),\
      configService.get<string>('SUPABASE_KEY')\
    );\
  \},\
  inject: [ConfigService],\
\};\
\
@Global()\
@Module(\{\
  imports: [ConfigModule],\
  providers: [SupabaseProvider],\
  exports: ['SUPABASE_CLIENT']\
\})\
export class SupabaseModule \{\}\
}