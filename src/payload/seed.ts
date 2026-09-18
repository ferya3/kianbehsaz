/**
 * Development seed: enough content for every page and every language to render
 * something real.
 *
 * Run with `npm run seed`. It is idempotent — documents are matched by slug, so
 * re-running updates instead of duplicating. It never runs automatically, and
 * it refuses to touch a production database.
 */
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Locale } from '../lib/i18n/config'
import { renderTexture, type TextureKind } from './textures'

type Translated = Record<Locale, string>

const LOCALES: Locale[] = ['fa', 'en', 'ar']

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: null,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      },
    ],
  },
})

const productCategories: { slug: string; title: Translated; description: Translated }[] = [
  {
    slug: 'structural-blocks',
    title: { fa: 'بلوک‌های سازه‌ای', en: 'Structural blocks', ar: 'الكتل الإنشائية' },
    description: {
      fa: 'بلوک‌های باربر و نیمه‌باربر برای دیوارهای سازه‌ای.',
      en: 'Load-bearing and semi load-bearing blocks for structural walls.',
      ar: 'كتل حاملة وشبه حاملة للجدران الإنشائية.',
    },
  },
  {
    slug: 'facade-bricks',
    title: { fa: 'آجر نما', en: 'Facade bricks', ar: 'طوب الواجهات' },
    description: {
      fa: 'آجرهای نما با جذب آب کنترل‌شده و ثبات رنگ.',
      en: 'Facade bricks with controlled water absorption and colour stability.',
      ar: 'طوب واجهات بامتصاص ماء مضبوط وثبات لوني.',
    },
  },
  {
    slug: 'refractory',
    title: { fa: 'محصولات نسوز', en: 'Refractory products', ar: 'المنتجات الحرارية' },
    description: {
      fa: 'محصولات نسوز برای کوره‌های صنعتی.',
      en: 'Refractory products for industrial furnaces.',
      ar: 'منتجات حرارية للأفران الصناعية.',
    },
  },
]

const projectCategories: { slug: string; title: Translated }[] = [
  { slug: 'industrial', title: { fa: 'صنعتی', en: 'Industrial', ar: 'صناعي' } },
  { slug: 'commercial', title: { fa: 'تجاری', en: 'Commercial', ar: 'تجاري' } },
  { slug: 'residential', title: { fa: 'مسکونی', en: 'Residential', ar: 'سكني' } },
  { slug: 'infrastructure', title: { fa: 'زیرساخت', en: 'Infrastructure', ar: 'بنية تحتية' } },
]

const articleCategories: { slug: string; title: Translated }[] = [
  { slug: 'industry', title: { fa: 'صنعت', en: 'Industry', ar: 'القطاع' } },
  { slug: 'technology', title: { fa: 'فناوری', en: 'Technology', ar: 'التقنية' } },
  { slug: 'company-news', title: { fa: 'اخبار شرکت', en: 'Company news', ar: 'أخبار الشركة' } },
]

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database.')
  }

  const payload = await getPayload({ config })

  type SeedCollection =
    | 'product-categories'
    | 'project-categories'
    | 'article-categories'
    | 'products'
    | 'projects'
    | 'articles'

  /**
   * Create-or-update by slug, one locale at a time. Payload's local API types
   * the `data` shape per collection slug, which a generic helper like this
   * cannot narrow — hence the single cast, confined to this function.
   */
  const upsert = async (
    collection: SeedCollection,
    slug: string,
    data: Record<string, unknown>,
    locale: Locale,
  ): Promise<number> => {
    const existing = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const current = existing.docs[0]

    const doc = current
      ? await payload.update({ collection, id: current.id, data: data as never, locale })
      : await payload.create({ collection, data: { ...data, slug } as never, locale })

    return doc.id
  }

  /** Ids of the rows already stored in an array field, in order. */
  const arrayRowIds = async (
    collection: SeedCollection,
    slug: string,
    field: string,
  ): Promise<(string | undefined)[]> => {
    const result = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const rows = (result.docs[0] as Record<string, unknown> | undefined)?.[field]
    if (!Array.isArray(rows)) return []

    return rows.map((row) => (row as { id?: string | null }).id ?? undefined)
  }

  /** Same, for an array field on a global. */
  const globalRowIds = async (
    slug: 'site-settings' | 'home-page' | 'careers',
    field: string,
  ): Promise<(string | undefined)[]> => {
    const doc = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<
      string,
      unknown
    >
    const rows = doc[field]
    if (!Array.isArray(rows)) return []

    return rows.map((row) => (row as { id?: string | null }).id ?? undefined)
  }

  /* ---------------------------------------------------------------- users */

  const adminEmail = 'admin@kianbehsaz.local'
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (!existingAdmin.docs[0]) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Seed Admin',
        email: adminEmail,
        password: 'ChangeMe123!',
        role: 'admin',
      },
    })
    payload.logger.info(`Created admin user ${adminEmail} (password: ChangeMe123!)`)
  }

  /* ---------------------------------------------------------------- media */

  /**
   * Every image slot in this design is filled, because an empty one in a
   * full-bleed dark layout reads as a mistake rather than as "no photo yet".
   * The surfaces are generated (see textures.ts) — swap any of them for a real
   * photograph from the admin panel and nothing in the code changes.
   */
  const mediaPlan: {
    kind: TextureKind
    alt: Translated
    gallery?: 'factory' | 'products' | 'projects' | 'team'
    width?: number
    height?: number
  }[] = [
    {
      kind: 'kiln',
      alt: {
        fa: 'دهانه کوره پخت در خط تولید',
        en: 'The mouth of the firing kiln on the production line',
        ar: 'فوهة فرن الحرق في خط الإنتاج',
      },
      gallery: 'factory',
      width: 2600,
      height: 1463,
    },
    {
      kind: 'clay',
      alt: {
        fa: 'نمای نزدیک آجر نمای پخته',
        en: 'Close-up of fired facade brick',
        ar: 'لقطة قريبة لطوب الواجهة المحروق',
      },
      gallery: 'products',
    },
    {
      kind: 'block',
      alt: {
        fa: 'بلوک‌های سازه‌ای چیده‌شده',
        en: 'Stacked structural blocks',
        ar: 'كتل إنشائية مرصوصة',
      },
      gallery: 'products',
    },
    {
      kind: 'refractory',
      alt: {
        fa: 'آجر نسوز در دمای کاری',
        en: 'Refractory brick at service temperature',
        ar: 'طوب حراري في درجة التشغيل',
      },
      gallery: 'products',
    },
    {
      kind: 'concrete',
      alt: {
        fa: 'سطح بتنی خط تولید',
        en: 'Concrete surface on the production line',
        ar: 'سطح خرساني في خط الإنتاج',
      },
      gallery: 'factory',
    },
    {
      kind: 'facade',
      alt: {
        fa: 'نمای ماژولار ساختمان صنعتی',
        en: 'Modular facade of an industrial building',
        ar: 'واجهة معيارية لمبنى صناعي',
      },
      gallery: 'projects',
    },
    {
      kind: 'tower',
      alt: {
        fa: 'برج اداری در شب',
        en: 'Office tower at night',
        ar: 'برج مكاتب ليلاً',
      },
      gallery: 'projects',
    },
    {
      kind: 'lab',
      alt: {
        fa: 'آزمایشگاه کنترل کیفیت',
        en: 'Quality control laboratory',
        ar: 'مختبر ضبط الجودة',
      },
      gallery: 'factory',
    },
  ]

  const mediaIds = {} as Record<TextureKind, number>

  for (const item of mediaPlan) {
    const filename = `${item.kind}.webp`
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs[0]) {
      mediaIds[item.kind] = existing.docs[0].id
      continue
    }

    const buffer = await renderTexture(item.kind, { width: item.width, height: item.height })

    const created = await payload.create({
      collection: 'media',
      locale: 'fa',
      data: {
        alt: item.alt.fa,
        showInGallery: Boolean(item.gallery),
        galleryCategory: item.gallery,
      },
      file: {
        data: buffer,
        mimetype: 'image/webp',
        name: filename,
        size: buffer.length,
      },
    })

    for (const locale of ['en', 'ar'] as const) {
      await payload.update({
        collection: 'media',
        id: created.id,
        locale,
        data: { alt: item.alt[locale] },
      })
    }

    mediaIds[item.kind] = created.id
    payload.logger.info(`Generated ${filename} (${Math.round(buffer.length / 1024)} KB)`)
  }

  /* ----------------------------------------------------------- taxonomies */

  const productCategoryIds: Record<string, number> = {}
  for (const [index, category] of productCategories.entries()) {
    let id = 0
    for (const locale of LOCALES) {
      id = await upsert(
        'product-categories',
        category.slug,
        {
          title: category.title[locale],
          description: category.description[locale],
          sortOrder: index,
        },
        locale,
      )
    }
    productCategoryIds[category.slug] = id
  }

  const projectCategoryIds: Record<string, number> = {}
  for (const [index, category] of projectCategories.entries()) {
    let id = 0
    for (const locale of LOCALES) {
      id = await upsert(
        'project-categories',
        category.slug,
        { title: category.title[locale], sortOrder: index },
        locale,
      )
    }
    projectCategoryIds[category.slug] = id
  }

  const articleCategoryIds: Record<string, number> = {}
  for (const [index, category] of articleCategories.entries()) {
    let id = 0
    for (const locale of LOCALES) {
      id = await upsert(
        'article-categories',
        category.slug,
        { title: category.title[locale], sortOrder: index },
        locale,
      )
    }
    articleCategoryIds[category.slug] = id
  }

  /* ------------------------------------------------------------- products */

  const products: {
    slug: string
    category: string
    media: TextureKind
    title: Translated
    short: Translated
    specs: { label: Translated; value: string; unit: string }[]
  }[] = [
    {
      slug: 'brick-x',
      category: 'facade-bricks',
      media: 'clay',
      title: { fa: 'آجر نما X', en: 'Brick X', ar: 'طوب X' },
      short: {
        fa: 'آجر نمای فشرده با جذب آب کمتر از ۶ درصد.',
        en: 'Dense facade brick with water absorption below 6%.',
        ar: 'طوب واجهات كثيف بامتصاص ماء أقل من ٦٪.',
      },
      specs: [
        { label: { fa: 'مقاومت فشاری', en: 'Compressive strength', ar: 'مقاومة الضغط' }, value: '45', unit: 'MPa' },
        { label: { fa: 'جذب آب', en: 'Water absorption', ar: 'امتصاص الماء' }, value: '5.4', unit: '%' },
        { label: { fa: 'ابعاد', en: 'Dimensions', ar: 'الأبعاد' }, value: '220×105×55', unit: 'mm' },
      ],
    },
    {
      slug: 'block-s20',
      category: 'structural-blocks',
      media: 'block',
      title: { fa: 'بلوک سازه‌ای S20', en: 'Structural block S20', ar: 'كتلة إنشائية S20' },
      short: {
        fa: 'بلوک باربر ۲۰ سانتی برای دیوارهای سازه‌ای.',
        en: '200 mm load-bearing block for structural walls.',
        ar: 'كتلة حاملة ٢٠٠ مم للجدران الإنشائية.',
      },
      specs: [
        { label: { fa: 'مقاومت فشاری', en: 'Compressive strength', ar: 'مقاومة الضغط' }, value: '12', unit: 'MPa' },
        { label: { fa: 'چگالی', en: 'Density', ar: 'الكثافة' }, value: '1350', unit: 'kg/m³' },
      ],
    },
    {
      slug: 'refra-1400',
      category: 'refractory',
      media: 'refractory',
      title: { fa: 'نسوز ۱۴۰۰', en: 'Refra 1400', ar: 'حراري 1400' },
      short: {
        fa: 'آجر نسوز با دمای کاری تا ۱۴۰۰ درجه سانتی‌گراد.',
        en: 'Refractory brick rated for service up to 1400 °C.',
        ar: 'طوب حراري لدرجة تشغيل تصل إلى ١٤٠٠ °م.',
      },
      specs: [
        { label: { fa: 'دمای کاری', en: 'Service temperature', ar: 'درجة التشغيل' }, value: '1400', unit: '°C' },
        { label: { fa: 'محتوای آلومینا', en: 'Alumina content', ar: 'محتوى الألومينا' }, value: '42', unit: '%' },
      ],
    },
  ]

  for (const [index, product] of products.entries()) {
    /**
     * Array rows are shared across locales and identified by id; only the
     * fields marked `localized` differ per language. Writing rows without an
     * id replaces the whole array, which would discard the previous locale's
     * translations — so the first pass creates the rows and later passes
     * address them by id.
     */
    let specIds: (string | undefined)[] = []

    for (const locale of LOCALES) {
      await upsert(
        'products',
        product.slug,
        {
          title: product.title[locale],
          shortDescription: product.short[locale],
          description: richText(product.short[locale]),
          category: productCategoryIds[product.category],
          coverImage: mediaIds[product.media],
          status: 'published',
          featured: true,
          sortOrder: index,
          specifications: product.specs.map((spec, row) => ({
            id: specIds[row],
            label: spec.label[locale],
            value: spec.value,
            unit: spec.unit,
          })),
        },
        locale,
      )

      if (!specIds.length) {
        specIds = await arrayRowIds('products', product.slug, 'specifications')
      }
    }
  }

  /* ------------------------------------------------------------- projects */

  const projects = [
    {
      slug: 'shiraz-logistics-hub',
      category: 'industrial',
      media: 'facade' as TextureKind,
      year: 2023,
      title: {
        fa: 'مرکز لجستیک شیراز',
        en: 'Shiraz logistics hub',
        ar: 'مركز شيراز اللوجستي',
      },
      summary: {
        fa: 'اجرای نمای ۱۸٬۰۰۰ متر مربعی انبار مرکزی.',
        en: '18,000 m² facade package for a central warehouse.',
        ar: 'حزمة واجهات بمساحة ١٨٬٠٠٠ م² لمستودع مركزي.',
      },
      location: { fa: 'شیراز، ایران', en: 'Shiraz, Iran', ar: 'شيراز، إيران' },
    },
    {
      slug: 'tehran-office-tower',
      category: 'commercial',
      media: 'tower' as TextureKind,
      year: 2022,
      title: { fa: 'برج اداری تهران', en: 'Tehran office tower', ar: 'برج مكاتب طهران' },
      summary: {
        fa: 'نمای آجری ۲۴ طبقه با جزئیات اجرایی اختصاصی.',
        en: 'A 24-storey brick facade with bespoke detailing.',
        ar: 'واجهة طوب من ٢٤ طابقًا بتفاصيل تنفيذ خاصة.',
      },
      location: { fa: 'تهران، ایران', en: 'Tehran, Iran', ar: 'طهران، إيران' },
    },
  ]

  for (const project of projects) {
    for (const locale of LOCALES) {
      await upsert(
        'projects',
        project.slug,
        {
          title: project.title[locale],
          summary: project.summary[locale],
          description: richText(project.summary[locale]),
          location: project.location[locale],
          year: project.year,
          category: projectCategoryIds[project.category],
          coverImage: mediaIds[project.media],
          status: 'published',
          featured: true,
        },
        locale,
      )
    }
  }

  /* ------------------------------------------------------------- articles */

  const articles = [
    {
      slug: 'choosing-facade-brick',
      category: 'technology',
      media: 'clay' as TextureKind,
      title: {
        fa: 'چگونه آجر نمای مناسب را انتخاب کنیم',
        en: 'How to choose the right facade brick',
        ar: 'كيف تختار طوب الواجهة المناسب',
      },
      excerpt: {
        fa: 'جذب آب، مقاومت یخبندان و ثبات رنگ؛ سه عددی که پیش از سفارش باید بدانید.',
        en: 'Water absorption, freeze-thaw resistance and colour stability: three numbers to check before ordering.',
        ar: 'امتصاص الماء ومقاومة التجمد وثبات اللون: ثلاثة أرقام تُراجع قبل الطلب.',
      },
    },
    {
      slug: 'quality-control-in-practice',
      category: 'industry',
      media: 'lab' as TextureKind,
      title: {
        fa: 'کنترل کیفیت در عمل',
        en: 'Quality control in practice',
        ar: 'ضبط الجودة عمليًا',
      },
      excerpt: {
        fa: 'از نمونه‌برداری بچ تا گزارش آزمون قابل ارائه به کارفرما.',
        en: 'From batch sampling to a test report you can hand to the client.',
        ar: 'من أخذ عينة الدفعة إلى تقرير اختبار يُسلَّم للعميل.',
      },
    },
  ]

  for (const article of articles) {
    for (const locale of LOCALES) {
      await upsert(
        'articles',
        article.slug,
        {
          title: article.title[locale],
          excerpt: article.excerpt[locale],
          content: richText(article.excerpt[locale]),
          category: articleCategoryIds[article.category],
          coverImage: mediaIds[article.media],
          status: 'published',
          readingMinutes: 4,
        },
        locale,
      )
    }
  }

  /* -------------------------------------------------------------- globals */

  const siteNames: Translated = { fa: 'کیان بهساز', en: 'Kian Behsaz', ar: 'كيان بهساز' }
  const taglines: Translated = {
    fa: 'مصالح ساختمانی مهندسی‌شده',
    en: 'Engineered building materials',
    ar: 'مواد بناء هندسية',
  }

  const salesLabel: Translated = { fa: 'فروش', en: 'Sales', ar: 'المبيعات' }
  const statLabels: Translated[] = [
    { fa: 'سال تجربه', en: 'Years of experience', ar: 'سنة خبرة' },
    { fa: 'پروژه اجراشده', en: 'Completed projects', ar: 'مشروع منجز' },
    { fa: 'تن ظرفیت سالانه', en: 'Tonnes annual capacity', ar: 'طن طاقة سنوية' },
    { fa: 'کارفرمای فعال', en: 'Active clients', ar: 'عميل نشط' },
  ]
  const statValues = ['20+', '450+', '120k', '80+']

  // Same array-row rule as products: keep the row ids stable across locales,
  // or each pass replaces the rows and drops the previous translations.
  let phoneIds: (string | undefined)[] = []
  let emailIds: (string | undefined)[] = []
  let statIds: (string | undefined)[] = []

  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale,
      data: {
        siteName: siteNames[locale],
        tagline: taglines[locale],
        defaultSeoDescription: {
          fa: 'کیان بهساز تولیدکننده مصالح ساختمانی مهندسی‌شده برای پروژه‌های صنعتی، تجاری و مسکونی است.',
          en: 'Kian Behsaz manufactures engineered building materials for industrial, commercial and residential projects.',
          ar: 'تنتج كيان بهساز مواد بناء هندسية للمشاريع الصناعية والتجارية والسكنية.',
        }[locale],
        address: { fa: 'ایران، تهران', en: 'Tehran, Iran', ar: 'طهران، إيران' }[locale],
        openingHours: {
          fa: 'شنبه تا چهارشنبه، ۸ تا ۱۷',
          en: 'Saturday to Wednesday, 08:00–17:00',
          ar: 'السبت إلى الأربعاء، ٨:٠٠–١٧:٠٠',
        }[locale],
        phones: [{ id: phoneIds[0], label: salesLabel[locale], number: '+98 21 0000 0000' }],
        emails: [{ id: emailIds[0], label: salesLabel[locale], address: 'info@kianbehsaz.com' }],
        stats: statValues.map((value, row) => ({
          id: statIds[row],
          value,
          label: statLabels[row]![locale],
        })),
      },
    })

    if (!statIds.length) {
      phoneIds = await globalRowIds('site-settings', 'phones')
      emailIds = await globalRowIds('site-settings', 'emails')
      statIds = await globalRowIds('site-settings', 'stats')
    }
  }

  // Hero and intro imagery. The hero holds the only bright thing on the page,
  // so it gets the kiln.
  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug: 'home-page',
      locale,
      data: {
        hero: {
          title: {
            fa: 'مصالحی که بار را می‌پذیرد',
            en: 'Material that takes the load',
            ar: 'مواد تتحمل الحِمل',
          }[locale],
          subtitle: {
            fa: 'دو دهه تولید مصالح مهندسی‌شده برای پروژه‌های صنعتی، تجاری و زیرساختی. هر بچ آزمون می‌شود، هر عدد قابل اثبات است.',
            en: 'Two decades of engineered building materials for industrial, commercial and infrastructure projects. Every batch tested, every figure provable.',
            ar: 'عقدان من إنتاج مواد البناء الهندسية للمشاريع الصناعية والتجارية والبنية التحتية. كل دفعة تُختبر، وكل رقم قابل للإثبات.',
          }[locale],
          desktopMedia: mediaIds.kiln,
          mobileImage: mediaIds.kiln,
          overlayOpacity: 40,
          primaryCta: {
            label: { fa: 'محصولات', en: 'Products', ar: 'المنتجات' }[locale],
            href: '/products',
          },
          secondaryCta: {
            label: { fa: 'گفت‌وگو با تیم فنی', en: 'Talk to the engineers', ar: 'تحدث مع الفريق الفني' }[locale],
            href: '/contact',
          },
        },
        intro: {
          title: {
            fa: 'کیفیت وقتی معنا دارد که تکرارپذیر باشد',
            en: 'Quality only counts when it repeats',
            ar: 'الجودة لا تُحتسب إلا إذا تكررت',
          }[locale],
          body: {
            fa: 'یک بچ خوب تصادف است. چهارصد بچ پشت سر هم، فرایند است. کنترل کیفیت ما از ورود مواد اولیه شروع می‌شود و تا گزارش آزمونی که همراه محموله تحویل می‌دهیم ادامه دارد.',
            en: 'One good batch is an accident. Four hundred consecutive batches is a process. Our quality control starts at the raw material gate and ends with the test report that ships with the pallet.',
            ar: 'دفعة جيدة واحدة مصادفة. أربعمائة دفعة متتالية عملية. يبدأ ضبط الجودة لدينا عند بوابة المواد الأولية وينتهي بتقرير الاختبار المرافق للشحنة.',
          }[locale],
          image: mediaIds.concrete,
        },
      },
    })
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

await main()
