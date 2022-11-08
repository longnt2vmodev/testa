import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { StudentModule } from './api/student/student.module';
import { CompanyModule } from './api/company/company.module';
import { ManufactureModule } from './api/manufacture/manufacture.module';
import { ManuCompanyModule } from './api/manu-company/manu-company.module';
import { RecruitModule } from './api/recruit/recruit.module';
import { FieldModule } from './api/field/field.module';
import { FieldRecruitModule } from './api/field-recruit/field-recruit.module';
import { CvModule } from './api/cv/cv.module';
import { LetterModule } from './api/letter/letter.module';
import { NotiModule } from './api/noti/noti.module';
import { NewsModule } from './api/news/news.module';
import { RateModule } from './api/rate/rate.module';
import { FieldCvModule } from './api/field_cv/field_cv.module';
import { FieldNewsModule } from './api/field_news/field_news.module';
import { AccountNotiModule } from './api/account_noti/account_noti.module';
import { LetterStudentModule } from './api/letter_student/letter_student.module';
import { ApplyModule } from './api/apply/apply.module';
import { GateGateway } from './gate.gateway';

@Module({
  imports: [
    UserModule,
    AuthModule,
    // MongooseModule.forRoot('mongodb://localhost/assignment'),
    MongooseModule.forRoot(
      'mongodb+srv://user:2612000@cluster0.t5gyx.mongodb.net/assignment?retryWrites=true&w=majority',
    ),
    StudentModule,
    CompanyModule,
    ManufactureModule,
    ManuCompanyModule,
    RecruitModule,
    FieldModule,
    FieldRecruitModule,
    CvModule,
    LetterModule,
    NotiModule,
    NewsModule,
    RateModule,
    FieldCvModule,
    FieldNewsModule,
    AccountNotiModule,
    LetterStudentModule,
    ApplyModule,
  ],
  providers: [GateGateway],
})
export class AppModule {}
